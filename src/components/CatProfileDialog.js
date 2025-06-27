import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Avatar,
  Typography,
  Box,
  Divider,
  Chip,
  useTheme
} from '@mui/material';
import { Star } from '@mui/icons-material';

const CatProfileDialog = ({ open, onClose, cat }) => {
  const theme = useTheme();

  if (!cat) return null;

  // Generate a random cat meme URL
  const memeUrl = `https://cataas.com/cat/says/Meow!?${Date.now()}`;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        {cat.name}'s Profile
      </DialogTitle>
      <DialogContent>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Avatar
            src={cat.photoURL || cat.image}
            sx={{
              width: 150,
              height: 150,
              mx: 'auto',
              mb: 2,
              border: `3px solid ${theme.palette.primary.main}`
            }}
          />
          <Typography variant="h5" gutterBottom>
            {cat.name}, {cat.age}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {cat.breed}
          </Typography>
          
          {cat.isSuperLike && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Star sx={{ color: '#ffd700', mr: 1 }} />
              <Typography variant="caption" color="text.secondary">
                Super Liked
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
            About {cat.name}
          </Typography>
          <Typography variant="body1" paragraph>
            {cat.bio || `${cat.name} is a ${cat.age}-year-old ${cat.breed} looking for a purr-fect match!`}
          </Typography>
        </Box>

        {cat.personalityTraits?.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              Personality
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {cat.personalityTraits.map((trait, i) => (
                <Chip 
                  key={i} 
                  label={trait}
                  size="small"
                  sx={{ 
                    bgcolor: 'primary.light',
                    color: 'white',
                    '& .MuiChip-label': { px: 1.5 }
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
            Cat Meme of the Day
          </Typography>
          <Box 
            component="img" 
            src={memeUrl} 
            alt="Random cat meme" 
            sx={{ 
              width: '100%', 
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`
            }}
          />
        </Box>

        {cat.favoriteToy && (
          <Typography variant="body2" color="text.secondary">
            <strong>Favorite Toy:</strong> {cat.favoriteToy}
          </Typography>
        )}
        
        {cat.favoriteNapSpot && (
          <Typography variant="body2" color="text.secondary">
            <strong>Favorite Nap Spot:</strong> {cat.favoriteNapSpot}
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CatProfileDialog;
