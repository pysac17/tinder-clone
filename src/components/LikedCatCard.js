import React from 'react';
import { Card, CardMedia, CardContent, Typography, Button, Box, Chip, Avatar } from '@mui/material';
import { Star, Favorite, FavoriteBorder } from '@mui/icons-material';

const LikedCatCard = ({ cat, onViewProfile, isMatch }) => {
  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      position: 'relative',
      overflow: 'visible',
      '&:hover': {
        boxShadow: 3,
        transform: 'translateY(-4px)',
        transition: 'all 0.3s ease-in-out'
      },
      transition: 'all 0.3s ease-in-out'
    }}>
      {isMatch && (
        <Box
          sx={{
            position: 'absolute',
            top: -10,
            right: -10,
            bgcolor: 'primary.main',
            color: 'white',
            borderRadius: '50%',
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            boxShadow: 2
          }}
        >
          <Favorite sx={{ fontSize: 20 }} />
        </Box>
      )}
      
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={cat.photoURL || cat.image || 'https://placekitten.com/400/400'}
          alt={cat.name}
          sx={{ 
            objectFit: 'cover',
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4
          }}
        />
        
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            display: 'flex',
            gap: 1
          }}
        >
          {cat.isSuperLike && (
            <Box
              sx={{
                bgcolor: 'rgba(0, 0, 0, 0.7)',
                color: '#ffd700',
                borderRadius: 2,
                px: 1,
                py: 0.5,
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.7rem',
                backdropFilter: 'blur(5px)'
              }}
            >
              <Star sx={{ fontSize: 16, mr: 0.5 }} />
              Super Liked
            </Box>
          )}
          
          {!cat.userLiked && (
            <Box
              sx={{
                bgcolor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                borderRadius: 2,
                px: 1,
                py: 0.5,
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.7rem',
                backdropFilter: 'blur(5px)'
              }}
            >
              <Favorite sx={{ fontSize: 16, mr: 0.5, color: '#ff4081' }} />
              Liked You
            </Box>
          )}
        </Box>
      </Box>
      
      <CardContent sx={{ flexGrow: 1, pb: '8px !important' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" component="div">
            {cat.name}, {cat.age}
          </Typography>
          {cat.userLiked && (
            <Box sx={{ color: 'secondary.main' }}>
              <Favorite />
            </Box>
          )}
        </Box>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {cat.breed}
        </Typography>
        
        {cat.personalityTraits?.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1, mb: 1 }}>
            {cat.personalityTraits.slice(0, 3).map((trait, i) => (
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
      </CardContent>
      
      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={onViewProfile}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}
        >
          View Profile
        </Button>
      </Box>
    </Card>
  );
};

export default LikedCatCard;
