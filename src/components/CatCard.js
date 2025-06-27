import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  IconButton, 
  CardMedia,
  Collapse,
  Divider
} from '@mui/material';
import { 
  Info as InfoIcon, 
  Favorite as LikeIcon, 
  Star as SuperLikeIcon,
  Close as NopeIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import ImageWithFallback from './ImageWithFallback';

const CatCard = ({ cat, onLike, onReject, onInfo }) => {
  const [showInfo, setShowInfo] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  if (!cat) return null;

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <Card 
      sx={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: 3,
        position: 'relative'
      }}
    >
      {/* Main Image */}
      <Box sx={{ position: 'relative', flexGrow: 1, overflow: 'hidden' }}>
        <ImageWithFallback
          src={cat.photoURL || cat.image}
          alt={cat.name}
          width="100%"
          height="100%"
          objectFit="cover"
          onLoad={handleImageLoad}
          style={{
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
        />
        
        {/* Overlay Gradient */}
        <Box 
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            p: 3,
            color: 'white',
            textShadow: '1px 1px 3px rgba(0,0,0,0.5)'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
                {cat.name}, {cat.age}
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                {cat.breed}
              </Typography>
            </Box>
            <IconButton 
              onClick={() => setShowInfo(!showInfo)}
              sx={{ 
                color: 'white',
                bgcolor: 'rgba(0,0,0,0.3)',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.5)'
                }
              }}
            >
              <InfoIcon />
            </IconButton>
          </Box>
          
          {/* Personality Chips */}
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {Array.isArray(cat.personality) && cat.personality.slice(0, 3).map((trait, i) => (
              <Chip
                key={i}
                label={trait}
                size="small"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  backdropFilter: 'blur(5px)',
                  '& .MuiChip-label': {
                    px: 1,
                    py: 0.5
                  }
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
      
      {/* Collapsible Info Section */}
      <Collapse in={showInfo}>
        <Divider />
        <CardContent>
          <Typography variant="body1" color="text.secondary">
            {cat.bio || 'No bio available'}
          </Typography>
          
          {cat.distance !== undefined && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
              {Math.round(cat.distance * 10) / 10} miles away
            </Typography>
          )}
        </CardContent>
      </Collapse>
      
      {/* Action Buttons (if provided) */}
      {(onLike || onReject) && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-around', 
          p: 2,
          bgcolor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider'
        }}>
          <IconButton 
            onClick={onReject}
            sx={{
              bgcolor: 'white',
              boxShadow: 2,
              '&:hover': { bgcolor: '#ffebee' },
              '&:active': { transform: 'scale(0.95)' }
            }}
          >
            <NopeIcon color="error" />
          </IconButton>
          
          <IconButton 
            onClick={onLike}
            sx={{
              bgcolor: 'white',
              boxShadow: 2,
              '&:hover': { bgcolor: '#e8f5e9' },
              '&:active': { transform: 'scale(0.95)' }
            }}
          >
            <LikeIcon color="success" />
          </IconButton>
          
          <IconButton 
            onClick={() => onLike && onLike(true)}
            sx={{
              bgcolor: 'white',
              boxShadow: 2,
              '&:hover': { bgcolor: '#e3f2fd' },
              '&:active': { transform: 'scale(0.95)' }
            }}
          >
            <SuperLikeIcon color="primary" />
          </IconButton>
        </Box>
      )}
    </Card>
  );
};

export default CatCard;
