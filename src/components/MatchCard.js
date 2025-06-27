import React from 'react';
import { Card, CardMedia, CardContent, CardActions, Typography, Button, Badge, Box, Avatar } from '@mui/material';
import { Message, Star } from '@mui/icons-material';

const MatchCard = ({ match, onViewProfile, onMessage, currentUserId }) => {
  const { matchedCat, lastMessage, unreadCount, isSuperLike } = match;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={matchedCat.photoURL || matchedCat.image || 'https://placekitten.com/400/400'}
          alt={matchedCat.name}
          sx={{ objectFit: 'cover' }}
        />
        {isSuperLike && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(0, 0, 0, 0.6)',
              borderRadius: '50%',
              p: 0.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Star sx={{ color: '#ffd700' }} />
          </Box>
        )}
      </Box>
      
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" component="div">
            {matchedCat.name}, {matchedCat.age}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {matchedCat.breed}
        </Typography>
        
        {matchedCat.personalityTraits?.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1, mb: 1 }}>
            {matchedCat.personalityTraits.slice(0, 3).map((trait, i) => (
              <Box
                key={i}
                sx={{
                  bgcolor: 'primary.light',
                  color: 'white',
                  px: 1,
                  py: 0.2,
                  borderRadius: 1,
                  fontSize: '0.7rem'
                }}
              >
                {trait}
              </Box>
            ))}
          </Box>
        )}
        
        {lastMessage && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              mt: 1,
              fontStyle: lastMessage.senderId === currentUserId ? 'italic' : 'normal',
              fontWeight: lastMessage.senderId !== currentUserId && unreadCount > 0 ? 'bold' : 'normal',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {lastMessage.senderId === currentUserId ? 'You: ' : ''}
            {lastMessage.content}
          </Typography>
        )}
      </CardContent>
      
      <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
        <Button 
          size="small" 
          variant="outlined"
          onClick={onViewProfile}
          sx={{ borderRadius: 2 }}
        >
          View Profile
        </Button>
        <Badge 
          badgeContent={unreadCount} 
          color="error"
          invisible={unreadCount === 0}
        >
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={onMessage}
            startIcon={<Message />}
            sx={{ borderRadius: 2, minWidth: 120 }}
          >
            Message
          </Button>
        </Badge>
      </CardActions>
    </Card>
  );
};

export default MatchCard;
