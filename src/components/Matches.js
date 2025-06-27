import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Badge,
  Divider,
  IconButton,
  Paper,
  useTheme,
} from '@mui/material';
import { Chat as ChatIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import Chat from './Chat';

const Matches = ({ matches }) => {
  const [selectedMatch, setSelectedMatch] = useState(null);
  const theme = useTheme();

  const handleChatOpen = (match) => {
    setSelectedMatch(match);
  };

  const handleChatClose = () => {
    setSelectedMatch(null);
  };

  if (!matches || matches.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: '100%',
        p: 3,
        textAlign: 'center'
      }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No matches yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Keep swiping to find your purr-fect match!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      height: '100%',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Matches List */}
      <Paper 
        elevation={0} 
        sx={{ 
          width: { xs: '100%', sm: 350 },
          borderRight: '1px solid',
          borderColor: 'divider',
          overflowY: 'auto',
          display: selectedMatch ? { xs: 'none', sm: 'block' } : 'block'
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            Matches
          </Typography>
        </Box>
        <Divider />
        <List sx={{ p: 0 }}>
          {matches.map((match) => {
            const otherUser = match.users?.find(user => user.id !== match.currentUserId);
            const lastMessage = match.lastMessage?.content || 'Start a conversation!';
            const isUnread = match.unreadCount > 0;
            
            return (
              <React.Fragment key={match.id}>
                <ListItem 
                  button 
                  onClick={() => handleChatOpen(match)}
                  sx={{
                    bgcolor: selectedMatch?.id === match.id ? 'action.hover' : 'transparent',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Badge
                      color="error"
                      variant="dot"
                      invisible={!isUnread}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                    >
                      <Avatar 
                        src={otherUser?.photoURL} 
                        alt={otherUser?.name}
                        sx={{ width: 56, height: 56 }}
                      />
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography 
                        variant="subtitle1" 
                        fontWeight={isUnread ? 'bold' : 'normal'}
                        noWrap
                      >
                        {otherUser?.name || 'Unknown User'}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        color={isUnread ? 'text.primary' : 'text.secondary'}
                        noWrap
                        sx={{ 
                          fontWeight: isUnread ? 'medium' : 'normal',
                          maxWidth: 200
                        }}
                      >
                        {lastMessage}
                      </Typography>
                    }
                    sx={{ 
                      ml: 1,
                      '& .MuiListItemText-secondary': {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      },
                    }}
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    {match.lastMessage && (
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ whiteSpace: 'nowrap' }}
                      >
                        {format(new Date(match.lastMessage.timestamp), 'h:mm a')}
                      </Typography>
                    )}
                    {isUnread && (
                      <Box 
                        sx={{
                          bgcolor: theme.palette.primary.main,
                          color: 'white',
                          borderRadius: '50%',
                          width: 20,
                          height: 20,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mt: 0.5,
                        }}
                      >
                        <Typography variant="caption" sx={{ lineHeight: 1 }}>
                          {match.unreadCount > 9 ? '9+' : match.unreadCount}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            );
          })}
        </List>
      </Paper>

      {/* Chat Window */}
      <Box 
        sx={{
          flex: 1,
          display: selectedMatch ? 'block' : { xs: 'none', sm: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
          p: 2,
        }}
      >
        {selectedMatch ? (
          <Box sx={{ width: '100%', height: '100%' }}>
            <Chat match={selectedMatch} onClose={handleChatClose} />
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <ChatIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Select a match to start chatting
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your messages will appear here
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Matches;
