import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography, useTheme } from '@mui/material';
import { Home, Pets } from '@mui/icons-material';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          textAlign: 'center',
          py: 8,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: 200,
            height: 200,
            mb: 4,
            '& svg': {
              width: '100%',
              height: '100%',
              color: theme.palette.primary.main,
              opacity: 0.1,
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 0,
            },
          }}
        >
          <Pets />
          <Typography
            variant="h1"
            component="div"
            sx={{
              fontSize: '6rem',
              fontWeight: 'bold',
              lineHeight: 1,
              position: 'relative',
              zIndex: 1,
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: '"Chewy", cursive',
            }}
          >
            404
          </Typography>
        </Box>

        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            mb: 2,
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: '"Chewy", cursive',
          }}
        >
          Oops! Page Not Found
        </Typography>

        <Typography variant="h6" color="text.secondary" paragraph sx={{ maxWidth: '600px', mb: 4 }}>
          The page you're looking for might have been moved, deleted, or doesn't exist.
          Don't worry, even the best mousers sometimes chase the wrong tail!
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<Home />}
            onClick={() => navigate('/')}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 8,
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              boxShadow: `0 4px 20px ${theme.palette.primary.light}40`,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: `0 6px 25px ${theme.palette.primary.light}60`,
              },
              transition: 'all 0.3s ease',
            }}
          >
            Back to Home
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<Pets />}
            onClick={() => navigate('/swipe')}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 8,
              textTransform: 'none',
              fontSize: '1.1rem',
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Start Swiping
          </Button>
        </Box>

        <Box sx={{ mt: 8, opacity: 0.5 }}>
          <Typography variant="caption" color="text.secondary">
            Error 404: The cat you're looking for is not here. Maybe it's napping?
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
