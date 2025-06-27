import React from 'react';
import { Box, Container, Typography, Divider, Link as MuiLink } from '@mui/material';
import { Pets, Favorite, EmojiEmotions, SelfImprovement } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  
  const catFacts = [
    "Did you know? Cats sleep for 70% of their lives. The other 30% is spent judging you.",
    "Fact: Cats have 9 lives. This app helps them find 9 loves.",
    "Paw-some fact: The oldest cat lived to be 38 years old! That's 168 in human years!",
    "Meow-velous fact: A group of cats is called a 'clowder' or a 'glaring'.",
    "Purr-fect fact: Cats can make over 100 different sounds. Dogs? Only about 10.",
  ];
  
  const randomFact = catFacts[Math.floor(Math.random() * catFacts.length)];

  // Function to handle click and scroll to top
  const handleLinkClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 4,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.primary.main,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&:before': {
          content: '"🐾"',
          position: 'absolute',
          fontSize: '10rem',
          opacity: 0.1,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }
      }}
    >
      <Container maxWidth="lg">
        <Box textAlign="center" mb={3}>
          <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
            <Pets sx={{ fontSize: 40, mr: 1 }} />
            <MuiLink
              component={Link}
              to="/"
              onClick={handleLinkClick}
              sx={{ 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #ffffff 30%, #f3e5f5 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
                textDecoration: 'none',
                fontSize: '2.5rem',
                '&:hover': {
                  textDecoration: 'none',
                  opacity: 0.9,
                }
              }}
            >
              Cat-Tinder
            </MuiLink>
          </Box>
          
          <Typography variant="subtitle1" sx={{ mb: 2, fontStyle: 'italic' }}>
            "{randomFact}"
          </Typography>
          
          <Box display="flex" justifyContent="center" gap={2} my={3} flexWrap="wrap">
            <MuiLink 
              component={Link} 
              to="/about" 
              color="inherit" 
              underline="hover" 
              onClick={handleLinkClick}
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                '&:hover': {
                  color: 'secondary.light',
                }
              }}
            >
              <EmojiEmotions sx={{ mr: 0.5 }} /> About Us
            </MuiLink>
            <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.3)', my: 1 }} />
            <MuiLink 
              component={Link} 
              to="/blog" 
              color="inherit" 
              underline="hover"
              onClick={handleLinkClick}
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                '&:hover': {
                  color: 'secondary.light',
                }
              }}
            >
              <Pets sx={{ mr: 0.5 }} /> Cat Blog
            </MuiLink>
            <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.3)', my: 1 }} />
            <MuiLink 
              component={Link} 
              to="/faq" 
              color="inherit" 
              underline="hover"
              onClick={handleLinkClick}
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                '&:hover': {
                  color: 'secondary.light',
                }
              }}
            >
              <SelfImprovement sx={{ mr: 0.5 }} /> Cat-astrophe FAQ
            </MuiLink>
          </Box>
          
          <Box my={3}>
            <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
              Made with <Favorite fontSize="small" sx={{ color: 'pink', verticalAlign: 'middle', mx: 0.5 }} /> 
              and <span style={{ textDecoration: 'line-through' }}>cat hair</span> love
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, fontStyle: 'italic' }}>
              No actual cats were swiped left in the making of this app
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            gap: 3,
            '& > *': {
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'scale(1.2) rotate(10deg)'
              }
            }
          }}>
            <span role="img" aria-label="paw" style={{ fontSize: '1.5rem' }}>🐾</span>
            <span role="img" aria-label="cat face" style={{ fontSize: '1.5rem' }}>😺</span>
            <span role="img" aria-label="heart eyes cat" style={{ fontSize: '1.5rem' }}>😻</span>
            <span role="img" aria-label="cat with wry smile" style={{ fontSize: '1.5rem' }}>😼</span>
            <span role="img" aria-label="kissing cat" style={{ fontSize: '1.5rem' }}>😽</span>
          </Box>
          
          <Typography variant="body2" sx={{ mt: 3, opacity: 0.7 }}>
            &copy; {currentYear} Cat-Tinder - The purr-fect way to find your feline soulmate
          </Typography>
          
          <Typography variant="caption" display="block" sx={{ mt: 2, opacity: 0.5, fontSize: '0.7rem' }}>
            *Results not guaranteed. Your perfect match might be napping right now.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
