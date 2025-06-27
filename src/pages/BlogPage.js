import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  Grid, 
  Chip, 
  Divider, 
  TextField, 
  Button,
  Snackbar,
  Alert
} from '@mui/material';
import { Pets, Favorite, ChatBubble, AccessTime, Tag, Email } from '@mui/icons-material';
import emailjs from '@emailjs/browser';

const blogPosts = [
  {
    id: 1,
    title: '10 Signs Your Cat is Secretly a Matchmaker',
    excerpt: 'Is your feline friend playing cupid? Discover the subtle (and not-so-subtle) ways your cat might be setting you up on dates.',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    date: 'June 15, 2023',
    readTime: '4 min read',
    tags: ['Cat Behavior', 'Love', 'Humor'],
    comments: 12,
    likes: 45,
    url: 'https://exploringanimals.com/signs-your-cat-is-actually-your-soulmate-according-to-animal-behaviorists/'
  },
  {
    id: 2,
    title: 'The Purr-fect Profile Picture: A Guide',
    excerpt: 'Get more right swipes with these purr-fectly framed photos. Hint: The laser pointer trick actually works!',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',    date: 'June 8, 2023',
    readTime: '6 min read',
    tags: ['Tips', 'Photography', 'Profile Help'],
    comments: 8,
    likes: 37,
    url: 'https://otechworld.com/create-perfect-cat-pfp-for-online-profiles/'
  },
  {
    id: 3,
    title: 'Catnip or Catnap? Understanding Feline Attraction',
    excerpt: 'The science behind why some cats go wild for catnip while others couldn\'t care less. Plus: Does it actually help with dating?',
    image: 'https://coleandmarmalade.com/wp-content/uploads/2018/06/cover-2.jpg',    date: 'May 28, 2023',
    readTime: '8 min read',
    tags: ['Cat Science', 'Behavior', 'Fun Facts'],
    comments: 15,
    likes: 62,
    url: 'https://vetmd.in/what-is-catnip-and-how-does-it-affect-cats/'
  },
  {
    id: 4,
    title: 'From Hiss-terical to Paw-sitive: Our Favorite Cat-Tinder Success Stories',
    excerpt: 'Heartwarming tales of feline love at first sight (or third nap together). Warning: May cause excessive "aww" sounds.',
    image: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',    
    date: 'May 15, 2023',
    readTime: '10 min read',
    tags: ['Success Stories', 'Love'],
    comments: 24,
    likes: 89,
    url: 'https://www.rd.com/list/heartwarming-pet-stories/'
  },
  {
    id: 5,
    title: 'The Cat-titude Scale: What Your Cat\'s Personality Says About You',
    excerpt: 'Find out if your cat\'s diva behavior means you\'re destined for feline royalty or if their lazy ways are rubbing off on your dating life.',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    date: 'May 5, 2023',
    readTime: '7 min read',
    tags: ['Personality', 'Humor', 'Quizzes'],
    comments: 18,
    likes: 53,
    url: 'https://www.purina.com/articles/cat/behavior/understanding-cat-behavior/cat-personality-types'
  },
  {
    id: 6,
    title: 'The Ultimate Guide to Cat-Friendly Date Ideas',
    excerpt: 'Forget dinner and a movie. These purr-fect date ideas will have both you and your feline match meowing for more!',
    image: 'https://images.unsplash.com/photo-1491485880348-85d48a9e5312?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',    
    date: 'April 28, 2023',
    readTime: '9 min read',
    tags: ['Dating Tips', 'Activities', 'Guide'],
    comments: 11,
    likes: 67,
    url: 'https://www.thesprucepets.com/cat-friendly-date-ideas-554067'
  }
];

const BlogPage = () => {
  const [email, setEmail] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setSnackbarMessage('Please enter your email address');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    try {
      // Send email using EmailJS
      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID, 
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID, 
        {
          to_email: 'sachijshah@gmail.com',
          from_email: email,
          message: 'New subscriber to Cat-Tinder blog!',
        },
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY 
      );

      setSnackbarMessage('Thanks for subscribing! You\'ll hear from us soon.');
      setSnackbarSeverity('success');
      setEmail('');
    } catch (error) {
      console.error('Error sending email:', error);
      setSnackbarMessage('Failed to subscribe. Please try again later.');
      setSnackbarSeverity('error');
    } finally {
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleCardClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

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
          The Cat's Meow Blog
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Paws, relax, and enjoy our collection of feline-tastic stories and tips
        </Typography>
        <Divider sx={{ my: 4 }} />
      </Box>

      <Grid container spacing={4}>
        {blogPosts.map((post) => (
          <Grid item xs={12} md={6} lg={4} key={post.id}>
            <Card 
              onClick={() => handleCardClick(post.url)}
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 4,
                overflow: 'hidden',
                transition: 'transform 0.3s, box-shadow 0.3s',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6,
                }
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={post.image}
                alt={post.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placekitten.com/600/400';
                }}
                sx={{
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  }
                }}
              />
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box display="flex" alignItems="center" mb={2} flexWrap="wrap" gap={1}>
                  {post.tags.map((tag, index) => (
                    <Chip 
                      key={index} 
                      label={tag} 
                      size="small" 
                      icon={<Tag fontSize="small" />}
                      sx={{ 
                        borderRadius: 2,
                        bgcolor: 'primary.light',
                        color: 'primary.contrastText',
                        '& .MuiChip-icon': { color: 'inherit' }
                      }}
                    />
                  ))}
                </Box>
                <Typography 
                  variant="h5" 
                  component="h2" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 'bold',
                    minHeight: '4.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    '&:hover': {
                      color: 'primary.main',
                    },
                    transition: 'color 0.3s'
                  }}
                >
                  {post.title}
                </Typography>
                <Typography 
                  variant="body1" 
                  color="text.secondary" 
                  paragraph
                  sx={{ 
                    mb: 2,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {post.excerpt}
                </Typography>
                <Box 
                  display="flex" 
                  justifyContent="space-between" 
                  alignItems="center"
                  mt="auto"
                  pt={2}
                  sx={{ borderTop: '1px solid', borderColor: 'divider' }}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box display="flex" alignItems="center" color="text.secondary">
                      <AccessTime fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="caption">{post.readTime}</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">•</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {post.date}
                    </Typography>
                  </Box>
                  <Box display="flex" gap={1}>
                    <Button 
                      size="small" 
                      startIcon={<Favorite fontSize="small" />}
                      sx={{ color: 'text.secondary', minWidth: 'auto' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle like functionality
                      }}
                    >
                      {post.likes}
                    </Button>
                    <Button 
                      size="small" 
                      startIcon={<ChatBubble fontSize="small" />}
                      sx={{ color: 'text.secondary', minWidth: 'auto' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle comment functionality
                      }}
                    >
                      {post.comments}
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>


      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BlogPage;
