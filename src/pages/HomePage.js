import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  useTheme,
  CircularProgress
} from '@mui/material';
import { Pets, Favorite, Star, EmojiEmotions } from '@mui/icons-material';
import { useCats } from '../context/CatContext';
import { useAuth } from '../context/AuthContext';

const features = [
  {
    icon: <Pets fontSize="large" />,
    title: 'Swipe & Match',
    description: 'Swipe right on cats you like and left on those you want to pass. It\'s that simple!'
  },
  {
    icon: <Favorite fontSize="large" color="error" />,
    title: 'Find Your Purrfect Match',
    description: 'When two cats like each other, it\'s a match! Start chatting and plan your next playdate.'
  },
  {
    icon: <Star fontSize="large" color="warning" />,
    title: 'Premium Features',
    description: 'Get unlimited likes, see who liked you, and more with our premium membership!'
  }
];

const HomePage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { loading, error } = useCats();
  const theme = useTheme();

  // Show loading state only on initial load
  if (loading && currentUser) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Box textAlign="center">
          <CircularProgress size={60} sx={{ mb: 2, color: theme.palette.primary.main }} />
          <Typography variant="h6" color="textSecondary">Loading your purrfect matches...</Typography>
        </Box>
      </Box>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh" px={2}>
        <Box textAlign="center">
          <Pets sx={{ fontSize: 60, color: theme.palette.error.main, mb: 2 }} />
          <Typography variant="h6" color="error" gutterBottom>
            Oops! Something went wrong
          </Typography>
          <Typography color="textSecondary" paragraph>
            {error}
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            Try Again
          </Button>
        </Box>
      </Box>
    );
  }


  return (
    <Box sx={{ pt: 8, pb: 6 }}>
      <Container maxWidth="md">
        <Box textAlign="center" mb={8}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: '"Chewy", cursive',
              mb: 2,
              fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' }
            }}
          >
            Welcome to Cat-Tinder! {currentUser ? '😻' : '🐾'}
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            {currentUser 
              ? 'Find your purrfect feline friend today. Swipe, match, and start your cat-tastic journey!'
              : 'Join our community of cat lovers and find the purrfect match for your feline friend!'}
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate(currentUser ? '/swipe' : '/signup')}
              startIcon={<Pets />}
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
                minWidth: 180
              }}
            >
              {currentUser ? 'Start Swiping' : 'Get Started'}
            </Button>
            {!currentUser && (
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/login')}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 8,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  minWidth: 180
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Box>

        {/* Features Section */}
        <Box sx={{ mt: 12, mb: 8 }}>
          <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 6 }}>
            How It Works
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 3,
                    borderRadius: 4,
                    boxShadow: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: 'primary.light',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                      color: 'primary.contrastText'
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
