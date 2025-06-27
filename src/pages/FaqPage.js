import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  TextField, 
  Button, 
  Paper,
  Grid,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  Pets as PetsIcon,
  Favorite as FavoriteIcon,
  Help as HelpIcon,
  Email as EmailIcon,
  Info as InfoIcon,
  Search as SearchIcon,
  EmojiEmotions as EmojiIcon
} from '@mui/icons-material';

const FaqPage = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [question, setQuestion] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Question submitted:', question);
    setSubmitted(true);
    setQuestion('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  const faqCategories = [
    {
      title: '🐾 Getting Started',
      icon: <InfoIcon color="primary" />,
      items: [
        {
          question: 'How do I create an account?',
          answer: 'Click the "Sign Up" button, enter your email, create a purr-fect password, and you\'re ready to start swiping!'
        },
        {
          question: 'Is Cat-Tinder free to use?',
          answer: 'Yes, our basic features are free! We offer premium features like unlimited rewinds and profile boosts for those who want to take their cat-matching to the next level.'
        },
        {
          question: 'How do I set up my cat\'s profile?',
          answer: 'After signing up, go to your profile and click "Add a Cat". Upload some adorable photos and fill in your cat\'s details. Don\'t forget to include what makes your feline special!'
        }
      ]
    },
    {
      title: '❤️ Matching & Messaging',
      icon: <FavoriteIcon color="error" />,
      items: [
        {
          question: 'How does the matching work?',
          answer: 'Swipe right if you like a cat, left if you want to keep looking. If both you and another user swipe right, it\'s a match! You\'ll both be notified and can start chatting.'
        },
        {
          question: 'Can I rematch with a cat I passed on?',
          answer: 'With our Rewind feature (premium), you can go back to the last profile you saw. Otherwise, they might show up in your feed again!'
        },
        {
          question: 'How do I know if someone liked my cat?',
          answer: 'You\'ll get a notification when you get a new like or match. Check your notifications tab for updates!'
        }
      ]
    },
    {
      title: '🐱 Cat Care & Safety',
      icon: <PetsIcon color="secondary" />,
      items: [
        {
          question: 'How do I ensure my cat\'s safety?',
          answer: 'Always meet in a neutral place first and take introductions slowly. Our blog has great resources on cat introductions!'
        },
        {
          question: 'What if my cat doesn\'t get along with their match?',
          answer: 'Not every cat will be best friends right away! Take it slow and give them time to adjust to each other.'
        },
        {
          question: 'Do you verify the cats on the app?',
          answer: 'We do our best to verify all profiles. If you see anything suspicious, please report it to our support team.'
        }
      ]
    }
  ];

  // Filter FAQs based on search query
  const filteredCategories = faqCategories.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box textAlign="center" mb={6}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block',
            fontFamily: '"Chewy", cursive',
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            mb: 2
          }}
        >
          Cat-astrophe FAQ
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Paws and find answers to all your questions about Cat-Tinder
        </Typography>
        
        <Paper 
          component="form" 
          sx={{ 
            p: '2px 4px', 
            display: 'flex', 
            alignItems: 'center', 
            maxWidth: 600, 
            mx: 'auto',
            mt: 4,
            mb: 2,
            borderRadius: 4,
            boxShadow: 3
          }}
        >
          <SearchIcon sx={{ ml: 2, color: 'text.secondary' }} />
          <TextField
            fullWidth
            variant="standard"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ 
              mx: 2, 
              '& .MuiInput-underline:before': { borderBottom: 'none' },
              '& .MuiInput-underline:after': { borderBottom: 'none' },
              '&:hover .MuiInput-underline:before': { borderBottom: 'none' },
            }}
            InputProps={{ disableUnderline: true }}
          />
        </Paper>
        <Typography variant="caption" color="text.secondary">
          {searchQuery ? `Found ${filteredCategories.reduce((acc, cat) => acc + cat.items.length, 0)} results` : 'Browse by category'}
        </Typography>
      </Box>

      {filteredCategories.length > 0 ? (
        <Box sx={{ mb: 8 }}>
          {filteredCategories.map((category, catIndex) => (
            <Box key={catIndex} sx={{ mb: 4 }}>
              <Box display="flex" alignItems="center" mb={2}>
                {category.icon}
                <Typography variant="h5" component="h2" sx={{ ml: 1, fontWeight: 'bold' }}>
                  {category.title}
                </Typography>
              </Box>
              <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                {category.items.map((item, index) => (
                  <React.Fragment key={index}>
                    <Accordion 
                      expanded={expanded === `panel-${catIndex}-${index}`} 
                      onChange={handleChange(`panel-${catIndex}-${index}`)}
                      elevation={0}
                      sx={{
                        '&:before': { display: 'none' },
                        '&.Mui-expanded': { margin: 0 },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel-${catIndex}-${index}-content`}
                        id={`panel-${catIndex}-${index}-header`}
                        sx={{
                          backgroundColor: (theme) => 
                            expanded === `panel-${catIndex}-${index}` 
                              ? alpha(theme.palette.primary.light, 0.1)
                              : 'transparent',
                          '&:hover': {
                            backgroundColor: (theme) => alpha(theme.palette.primary.light, 0.05)
                          },
                          '&.Mui-expanded': {
                            minHeight: '48px',
                            '& .MuiAccordionSummary-content': {
                              margin: '12px 0',
                            },
                          },
                        }}
                      >
                        <Typography sx={{ fontWeight: 600 }}>{item.question}</Typography>
                      </AccordionSummary>
                      <AccordionDetails 
                        sx={{ 
                          backgroundColor: (theme) => alpha(theme.palette.primary.light, 0.05),
                          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                          pt: 2,
                          pb: 3,
                          px: 3
                        }}
                      >
                        <Typography color="text.secondary">
                          {item.answer}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                    {index < category.items.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </Paper>
            </Box>
          ))}
        </Box>
      ) : (
        <Box textAlign="center" py={6}>
          <EmojiIcon sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
          <Typography variant="h6" gutterBottom>
            No results found
          </Typography>
          <Typography color="text.secondary">
            We couldn't find any questions matching "{searchQuery}". Try different keywords or contact our support team.
          </Typography>
        </Box>
      )}

      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: 4,
          background: (theme) => alpha(theme.palette.primary.main, 0.05),
          border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
        }}
      >
        <Box textAlign="center" mb={3}>
          <HelpIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
          <Typography variant="h5" component="h2" gutterBottom>
            Still have questions?
          </Typography>
          <Typography color="text.secondary" paragraph>
            Our team of cat experts is here to help!
          </Typography>
        </Box>
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Your question"
                variant="outlined"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
                multiline
                rows={3}
                placeholder="Ask us anything about Cat-Tinder..."
              />
            </Grid>
            <Grid item xs={12}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                size="large"
                fullWidth
                startIcon={<EmailIcon />}
                sx={{ py: 1.5, borderRadius: 2 }}
              >
                Send Question
              </Button>
            </Grid>
            {submitted && (
              <Grid item xs={12}>
                <Typography color="success.main" textAlign="center">
                  Thanks for your question! We'll get back to you soon. 😸
                </Typography>
              </Grid>
            )}
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default FaqPage;