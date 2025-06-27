import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  buttonText, 
  onButtonClick, 
  buttonIcon: ButtonIcon 
}) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      textAlign: 'center',
      p: 4,
      borderRadius: 2,
      bgcolor: 'background.paper',
      boxShadow: 1,
      maxWidth: 500,
      mx: 'auto',
      my: 4
    }}>
      <Box sx={{ 
        width: 120, 
        height: 120, 
        borderRadius: '50%',
        bgcolor: 'action.hover',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 3
      }}>
        {Icon && (
          <Icon sx={{ 
            fontSize: 60,
            color: 'text.secondary'
          }} />
        )}
      </Box>
      
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
        {title}
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 3, maxWidth: '80%' }}>
        {description}
      </Typography>
      
      {buttonText && onButtonClick && (
        <Button
          variant="contained"
          color="primary"
          onClick={onButtonClick}
          startIcon={ButtonIcon && <ButtonIcon />}
          sx={{
            borderRadius: 3,
            px: 4,
            py: 1.5,
            textTransform: 'none',
            fontWeight: 'bold',
            fontSize: '1rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          {buttonText}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
