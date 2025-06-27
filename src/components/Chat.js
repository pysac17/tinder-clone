import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Box, 
  TextField, 
  IconButton, 
  Avatar, 
  Typography, 
  Paper, 
  CircularProgress
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';

const Chat = ({ match, onClose }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  const { messages, isLoading, sendMessage } = useChat();
  const { currentUser } = useAuth();
  
  // Memoize chatMessages to prevent unnecessary re-renders
  const chatMessages = useMemo(() => messages[match?.id] || [], [messages, match?.id]);
  const otherUser = match?.users?.find(u => u.id !== currentUser?.uid);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !match?.id) return;
    
    try {
      await sendMessage(match.id, message);
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (isLoading && !chatMessages.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: '100%',
      maxWidth: 500,
      margin: '0 auto',
      bgcolor: 'background.paper',
      borderRadius: 2,
      overflow: 'hidden',
      boxShadow: 3
    }}>
      {/* Chat Header */}
      <Box sx={{ 
        p: 2, 
        bgcolor: 'primary.main',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <Avatar 
          src={otherUser?.photoURL} 
          alt={otherUser?.name}
          sx={{ width: 40, height: 40 }}
        />
        <Typography variant="h6">{otherUser?.name || 'Chat'}</Typography>
      </Box>
      
      {/* Messages */}
      <Box sx={{ 
        flex: 1, 
        overflowY: 'auto',
        p: 2,
        bgcolor: '#f5f5f5',
        '& > *:not(:last-child)': {
          mb: 2
        }
      }}>
        {chatMessages.map((msg, index) => {
          const isCurrentUser = msg.senderId === currentUser?.uid;
          const showAvatar = index === 0 || 
            chatMessages[index - 1]?.senderId !== msg.senderId;
          
          return (
            <Box
              key={index}
              sx={{
                display: 'flex',
                flexDirection: isCurrentUser ? 'row-reverse' : 'row',
                alignItems: 'flex-end',
                gap: 1,
                maxWidth: '80%',
                ml: isCurrentUser ? 'auto' : 0,
              }}
            >
              {!isCurrentUser && showAvatar && (
                <Avatar 
                  src={!isCurrentUser ? otherUser?.photoURL : null}
                  sx={{ width: 32, height: 32 }}
                />
              )}
              
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: isCurrentUser ? 'flex-end' : 'flex-start',
                flex: 1
              }}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 1.5,
                    borderRadius: 4,
                    bgcolor: isCurrentUser ? 'primary.main' : 'background.paper',
                    color: isCurrentUser ? 'white' : 'text.primary',
                    borderTopLeftRadius: isCurrentUser ? 16 : 4,
                    borderTopRightRadius: isCurrentUser ? 4 : 16,
                  }}
                >
                  <Typography variant="body1">
                    {msg.content === 'meowww' ? 'Meowww 😺' : msg.content}
                  </Typography>
                </Paper>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    mt: 0.5, 
                    color: 'text.secondary',
                    alignSelf: isCurrentUser ? 'flex-end' : 'flex-start'
                  }}
                >
                  {format(new Date(msg.timestamp), 'h:mm a')}
                </Typography>
              </Box>
              
              {isCurrentUser && (
                <Avatar 
                  src={currentUser?.photoURL}
                  sx={{ width: 32, height: 32, visibility: 'hidden' }}
                />
              )}
            </Box>
          );
        })}
        <div ref={messagesEndRef} />
      </Box>
      
      {/* Message Input */}
      <Box component="form" onSubmit={handleSendMessage} sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 20,
                bgcolor: 'background.paper',
              },
            }}
          />
          <IconButton 
            type="submit" 
            color="primary" 
            disabled={!message.trim()}
            sx={{ 
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
              '&:disabled': {
                bgcolor: 'action.disabledBackground',
                color: 'text.disabled',
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;
