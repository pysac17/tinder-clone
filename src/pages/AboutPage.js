import React from 'react';
import { Box, Container, Typography, Paper, Avatar, Grid } from '@mui/material';
import { Pets, Favorite, EmojiEmotions } from '@mui/icons-material';

const teamMembers = [
  {
    name: 'Whiskers',
    role: 'Chief Executive Cat',
    bio: 'Professional napper and treat enthusiast. Expert at knocking things off tables.',
    emoji: '😼'
  },
  {
    name: 'Mittens',
    role: 'Head of Cuteness',
    bio: 'Specializes in making biscuits and stealing hearts. Can open any door (or so she thinks).',
    emoji: '😻'
  },
  {
    name: 'Mr. Fluffington',
    role: 'Director of Purr-sonnel',
    bio: 'Handles all the serious business of looking majestic. Also enjoys cardboard boxes.',
    emoji: '😸'
  },
  {
    name: 'Luna',
    role: 'Paw-duct Manager',
    bio: 'Night owl and laser pointer chaser. Believes all laps were made for sitting.',
    emoji: '😺'
  }
];

const AboutPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box textAlign="center" mb={8}>
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom
          sx={{
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block',
            fontFamily: '"Chewy", cursive',
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            mb: 2
          }}
        >
          About Us & Our Purr-pose
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          The tail of how we became the #1 cat matchmaking service
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4, mb: 6, borderRadius: 4 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <Pets color="primary" sx={{ fontSize: 40, mr: 2 }} />
          <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
            Our Story
          </Typography>
        </Box>
        <Typography paragraph>
          Once upon a time in a land not so far away, a group of cat lovers noticed something tragic: 
          too many fabulous felines were spending their 9 lives without finding their purr-fect match. 
          And thus, Cat-Tinder was born - because every cat deserves to find their fur-ever friend!
        </Typography>
        <Typography paragraph>
          What started as a simple idea (and possibly too much catnip) has grown into the world's 
          premier feline matchmaking service. We've helped over 1,000,000 cats find love, friendship, 
          or at least someone to share their sunbeam with.
        </Typography>
        <Box display="flex" alignItems="center" mt={4}>
          <Favorite color="error" sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Fun fact: Our first-ever match was between Mr. Whiskers and Princess Fluffbottom. 
            They've been happily ignoring each other ever since!
          </Typography>
        </Box>
      </Paper>

      <Box textAlign="center" mb={6}>
        <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
          Meet the Humans Who Make the Magic Happen
          <Box component="span" sx={{ ml: 1 }}>✨</Box>
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          (Don't tell them, but the cats are really in charge)
        </Typography>
      </Box>

      <Grid container spacing={4} mb={8}>
        {teamMembers.map((member, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3, 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                borderRadius: 4,
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6,
                }
              }}
            >
              <Avatar 
                sx={{ 
                  width: 100, 
                  height: 100, 
                  fontSize: '3rem',
                  mb: 2,
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText'
                }}
              >
                {member.emoji}
              </Avatar>
              <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                {member.name}
              </Typography>
              <Typography 
                variant="subtitle1" 
                color="primary" 
                gutterBottom
                sx={{ 
                  fontWeight: 'medium',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <EmojiEmotions sx={{ mr: 1, fontSize: '1.2rem' }} />
                {member.role}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {member.bio}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: 4,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
          textAlign: 'center'
        }}
      >
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
          Our Mission
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          To help every cat find their purr-fect match, one paw-swipe at a time.
        </Typography>
        <Typography variant="body1" paragraph>
          Whether you're a sophisticated Siamese or a laid-back Tabby, we believe there's a perfect 
          match out there for every cat. Our advanced algorithm (patent-pending) considers important 
          factors like nap preferences, toy preferences, and tolerance for belly rubs to create 
          purr-fectly matched pairs.
        </Typography>
        <Box display="flex" justifyContent="center" mt={3}>
          <Typography 
            variant="h6" 
            sx={{ 
              display: 'inline-flex',
              alignItems: 'center',
              fontStyle: 'italic',
              color: 'primary.main'
            }}
          >
            <Pets sx={{ mr: 1 }} />
            Because even cats deserve a happily ever after.
            <Pets sx={{ ml: 1 }} />
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default AboutPage;
