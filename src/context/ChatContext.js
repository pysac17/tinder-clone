import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getMessages, sendMessage as sendMessageApi, markMessagesAsRead } from '../api';

const ChatContext = createContext();

// Helper function to generate cat-like responses
const generateCatResponse = () => {
  const meowCount = Math.floor(Math.random() * 5) + 1; // 1-5 meows
  return 'meow '.repeat(meowCount).trim() + (Math.random() > 0.7 ? ' 🐾' : ' 😺');
};

export const ChatProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState({});
  const [chatHistory, setChatHistory] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load messages for a specific chat
  const loadMessages = useCallback(async (matchId) => {
    if (!matchId) return [];
    
    try {
      setLoading(true);
      const data = await getMessages(matchId);
      const messages = data.messages || [];
      
      // Store messages in chat history
      setChatHistory(prev => ({
        ...prev,
        [matchId]: messages
      }));
      
      setMessages(prev => ({
        ...prev,
        [matchId]: messages
      }));
      
      return messages;
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Failed to load messages');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Send a new message
  const sendMessage = useCallback(async (matchId, content) => {
    if (!matchId || !content.trim()) return null;

    // Generate a temporary ID for optimistic update
    const tempId = `temp-${Date.now()}`;
    const newMessage = {
      id: tempId,
      matchId,
      content: content.trim(),
      senderId: currentUser?.uid,
      timestamp: new Date().toISOString(),
      isOptimistic: true
    };

    try {
      // Optimistic update
      setMessages(prev => ({
        ...prev,
        [matchId]: [...(prev[matchId] || []), newMessage]
      }));

      // Send to server
      const response = await sendMessageApi(matchId, content.trim());
      
      // Update with server response
      setMessages(prev => ({
        ...prev,
        [matchId]: (prev[matchId] || []).map(msg => 
          msg.id === tempId ? response.message : msg
        )
      }));

      // Generate cat response after a short delay (1-3 seconds)
      const isBotChat = matchId.startsWith('bot_');
      if (isBotChat) {
        setTimeout(() => {
          const catResponse = {
            id: `cat-${Date.now()}`,
            matchId,
            content: generateCatResponse(),
            senderId: matchId, // The bot's ID is the matchId for bot chats
            timestamp: new Date().toISOString(),
            isBot: true
          };
          
          setMessages(prev => ({
            ...prev,
            [matchId]: [...(prev[matchId] || []), catResponse]
          }));
          
          // Add to chat history
          setChatHistory(prev => ({
            ...prev,
            [matchId]: [...(prev[matchId] || []), catResponse]
          }));
          
        }, 1000 + Math.random() * 2000); // 1-3 second delay
      }

      // Update chat history
      setChatHistory(prev => ({
        ...prev,
        [matchId]: [
          ...(prev[matchId] || []).filter(m => m.id !== tempId),
          response.message
        ]
      }));

      return response.message;
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
      
      // Revert optimistic update on error
      setMessages(prev => ({
        ...prev,
        [matchId]: (prev[matchId] || []).filter(msg => msg.id !== tempId)
      }));
      
      throw err;
    }
  }, [currentUser?.uid]);

  // Mark messages as read
  const markAsRead = useCallback(async (matchId) => {
    if (!matchId) return;
    
    try {
      await markMessagesAsRead(matchId);
      setUnreadCounts(prev => ({
        ...prev,
        [matchId]: 0
      }));
    } catch (err) {
      console.error('Error marking messages as read:', err);
      // Don't show error to user for read receipts
    }
  }, []);

  // Set active chat and load messages
  const setActiveChatAndLoad = useCallback(async (matchId) => {
    setActiveChat(matchId);
    if (matchId) {
      // Check if we have chat history, if not, load from server
      if (!chatHistory[matchId]) {
        await loadMessages(matchId);
      } else {
        // If we have history, use it for instant display
        setMessages(prev => ({
          ...prev,
          [matchId]: chatHistory[matchId]
        }));
      }
      await markAsRead(matchId);
    }
  }, [loadMessages, markAsRead, chatHistory]);

  // Initialize polling for new messages
  useEffect(() => {
    if (!currentUser || !activeChat) return;

    const pollInterval = setInterval(() => {
      if (activeChat) {
        loadMessages(activeChat);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(pollInterval);
  }, [currentUser, activeChat, loadMessages]);

  return (
    <ChatContext.Provider
      value={{
        activeChat,
        messages: messages[activeChat] || [],
        chatHistory: chatHistory[activeChat] || [],
        unreadCounts,
        loading,
        error,
        loadMessages,
        sendMessage,
        markAsRead,
        setActiveChat: setActiveChatAndLoad,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export default ChatContext;
