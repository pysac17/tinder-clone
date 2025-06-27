import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  IconButton, 
  Avatar, 
  Paper, 
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip
} from '@mui/material';
import { Send as SendIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { formatDistanceToNow } from 'date-fns';

const ChatPage = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { 
    messages, 
    sendMessage: sendChatMessage, 
    loading, 
    error, 
    setActiveChat,
    markAsRead 
  } = useChat();
  
  const [message, setMessage] = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Load chat data and set active chat
  useEffect(() => {
    if (matchId) {
      setActiveChat(matchId);
      loadChatData();
    }
    
    return () => setActiveChat(null);
  }, [matchId, setActiveChat]);

  // Load chat participant data
  const loadChatData = useCallback(async () => {
    if (!matchId || !currentUser) return;

    try {
      // Get all matches and find the one we need
      const matchesResponse = await api.get('/api/matches');
      const matchesData = matchesResponse.data;
      
      if (!matchesData || !matchesData.success || !Array.isArray(matchesData.matches)) {
        throw new Error('Failed to load matches');
      }

      // Find the specific match by ID
      const matchData = matchesData.matches.find(match => match.id === matchId);
      
      if (!matchData) {
        throw new Error('Match not found');
      }

      // Find the other user's ID
      const otherUserId = matchData.users.find(id => id !== currentUser.uid);
      if (!otherUserId) {
        throw new Error('Could not find chat participant');
      }

      // For bot users, we don't need to fetch user data
      if (matchId.startsWith('bot_')) {
        setOtherUser({
          id: matchId,
          name: 'Cat Bot',
          photoURL: 'https://placekitten.com/300/300',
          isBot: true
        });
      } else {
        // Get other user's profile for real users
        const userResponse = await api.get(`/api/users/${otherUserId}`);
        const userData = userResponse.data;
        
        setOtherUser({
          id: otherUserId,
          name: userData.displayName || 'Cat Lover',
          photoURL: userData.photoURL,
          isBot: false
        });
      }

      // Mark messages as read
      await markAsRead(matchId);
    } catch (err) {
      console.error('Error loading chat data:', err);
    }
  }, [matchId, currentUser, markAsRead]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !matchId || isSending) return;
    
    try {
      setIsSending(true);
      await sendChatMessage(matchId, message);
      setMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setIsSending(false);
    }
  };

  // Format message timestamp
  const formatTime = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (e) {
      return '';
    }
  };

  if (loading && !otherUser) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!otherUser) {
    return (
      <Box p={3}>
        <Typography>Chat not found</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Chat Header */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          p: 2, 
          borderBottom: '1px solid', 
          borderColor: 'divider',
          bgcolor: 'background.paper',
          position: 'sticky',
          top: 0,
          zIndex: 1
        }}
      >
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Avatar 
          src={otherUser.photoURL} 
          alt={otherUser.name}
          sx={{ width: 40, height: 40, mr: 2 }}
        />
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">{otherUser.name}</Typography>
          <Typography variant="caption" color="text.secondary">
            {otherUser.isBot ? 'Online' : 'Last seen recently'}
          </Typography>
        </Box>
      </Box>

      {/* Messages */}
      <Box 
        ref={messagesContainerRef}
        sx={{ 
          flex: 1, 
          overflowY: 'auto', 
          p: 2,
          bgcolor: 'background.default',
          '&::-webkit-scrollbar': {
            width: '0.4em',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.1)',
            borderRadius: '4px',
          },
        }}
      >
        <List sx={{ width: '100%' }}>
          {messages.map((msg) => {
            const isCurrentUser = msg.senderId === currentUser.uid;
            const isBotMessage = msg.isBot || msg.senderId.startsWith('bot_');
            const avatarSrc = isCurrentUser 
              ? currentUser.photoURL 
              : (isBotMessage ? 'https://placekitten.com/300/300' : otherUser.photoURL);
            
            return (
              <ListItem 
                key={msg.id || msg.timestamp} 
                sx={{
                  display: 'flex',
                  flexDirection: isCurrentUser ? 'row-reverse' : 'row',
                  alignItems: 'flex-start',
                  mb: 1,
                  px: 1,
                }}
              >
                <Tooltip title={isCurrentUser ? 'You' : (isBotMessage ? 'Cat Bot' : otherUser.name)}>
                  <ListItemAvatar 
                    sx={{
                      minWidth: '40px',
                      alignSelf: 'flex-end',
                      mr: isCurrentUser ? 0 : 1,
                      ml: isCurrentUser ? 1 : 0,
                    }}
                  >
                    <Avatar 
                      src={avatarSrc} 
                      alt={isCurrentUser ? 'You' : otherUser.name}
                      sx={{ width: 32, height: 32 }}
                    />
                  </ListItemAvatar>
                </Tooltip>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    maxWidth: '70%',
                    borderRadius: 2,
                    backgroundColor: isCurrentUser 
                      ? 'primary.main' 
                      : (isBotMessage ? 'background.paper' : 'grey.100'),
                    color: isCurrentUser ? 'primary.contrastText' : 'text.primary',
                    border: isBotMessage ? '1px solid' : 'none',
                    borderColor: isBotMessage ? 'divider' : 'transparent',
                  }}
                >
                  <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                    {msg.content}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{
                      display: 'block',
                      textAlign: 'right',
                      mt: 0.5,
                      color: isCurrentUser ? 'primary.contrastText' : 'text.secondary',
                      opacity: 0.8,
                      fontSize: '0.7rem',
                    }}
                  >
                    {formatTime(msg.timestamp)}
                  </Typography>
                </Paper>
              </ListItem>
            );
          })}
          <div ref={messagesEndRef} />
        </List>
      </Box>

      {/* Message Input */}
      <Box 
        component="form" 
        onSubmit={handleSendMessage}
        sx={{ 
          p: 2, 
          borderTop: '1px solid', 
          borderColor: 'divider',
          bgcolor: 'background.paper',
          position: 'sticky',
          bottom: 0,
        }}
      >
        <Box display="flex" alignItems="center">
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
            disabled={isSending}
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 4,
                backgroundColor: 'background.paper',
              },
              mr: 1,
            }}
          />
          <IconButton 
            type="submit" 
            color="primary" 
            disabled={!message.trim() || isSending}
            sx={{ 
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
              '&:disabled': {
                backgroundColor: 'action.disabled',
              },
            }}
          >
            {isSending ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
          </IconButton>
        </Box>
      </Box>
    </Container>
  );
};

export default ChatPage;
