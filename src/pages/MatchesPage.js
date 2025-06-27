import React, { useEffect, useState, useCallback } from 'react';
import { useCats } from '../context/CatContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  Box, 
  Tabs, 
  Tab, 
  CircularProgress,
  Alert,
  CardActionArea,
  Chip,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ChatBubbleOutline, Favorite, FavoriteBorder, Pets } from '@mui/icons-material';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const StyledCardMedia = styled(CardMedia)({
  paddingTop: '100%', // 1:1 aspect ratio
  backgroundSize: 'cover',
  backgroundPosition: 'center',
});

const MatchStatusChip = styled(Chip)(({ theme, matchstatus }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  backgroundColor: matchstatus === 'matched' ? theme.palette.success.main : theme.palette.warning.main,
  color: theme.palette.common.white,
  fontWeight: 'bold',
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`matches-tabpanel-${index}`}
      aria-labelledby={`matches-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `matches-tab-${index}`,
    'aria-controls': `matches-tabpanel-${index}`,
  };
}

export default function MatchesPage() {
  const [activeTab, setActiveTab] = useState(0);
  const { 
    matches, 
    likedCats, 
    loadMatches, 
    loadLikedCats, 
    loading, 
    error 
  } = useCats();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          loadMatches(),
          loadLikedCats()
        ]);
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };

    if (currentUser) {
      fetchData();
    }
  }, [currentUser, loadMatches, loadLikedCats]);

  useEffect(() => {
    console.log('Current matches data:', matches);
  }, [matches]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleChatClick = (matchId) => {
    navigate(`/chat/${matchId}`, { state: { matchId } });
  };

  const renderCatCard = (item, isMatch = false) => {
    // Debug log the raw item
    console.log('Raw item data:', JSON.stringify(item, null, 2));

    // Handle both nested and flat data structures
    const cat = item.cat || item;
    
    if (!cat) {
      console.error('No cat data available for item:', item);
      return null;
    }

    // Debug log the processed cat data
    console.log('Processing cat data:', {
      id: cat.id,
      name: cat.name,
      hasPhotos: !!cat.photos,
      hasImage: !!cat.image,
      hasPhotoURL: !!cat.photoURL
    });

    // Get the image URL - check multiple possible properties
    const getImageUrl = () => {
      if (cat.photos && Array.isArray(cat.photos) && cat.photos.length > 0) {
        return cat.photos[0];
      }
      if (cat.image) {
        return cat.image;
      }
      if (cat.photoURL) {
        return cat.photoURL;
      }
      console.warn('No image found for cat:', cat.id);
      return 'https://via.placeholder.com/300';
    };

    return (
      <Grid item xs={12} sm={6} md={4} lg={3} key={cat.id || item.matchId}>
        <StyledCard>
          <Box sx={{ position: 'relative' }}>
            <CardActionArea>
              <StyledCardMedia
                image={getImageUrl()}
                title={cat.name || 'Cat'}
              />
            </CardActionArea>
            {isMatch && item.status && (
              <MatchStatusChip 
                size="small" 
                label={item.status === 'matched' ? 'Matched' : 'Pending'} 
                matchstatus={item.status}
              />
            )}
          </Box>
          <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" component="h3" noWrap>
                {cat.name || 'Unnamed Cat'}
              </Typography>
              {cat.age !== undefined && (
                <Typography variant="body2" color="text.secondary">
                  {cat.age} {cat.age === 1 ? 'year' : 'years'} old
                </Typography>
              )}
            </Box>
            
            {cat.breed && (
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {cat.breed}
              </Typography>
            )}
            
            {cat.bio && (
              <Typography variant="body2" color="text.secondary" sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                mb: 2
              }}>
                {cat.bio}
              </Typography>
            )}
            
            <Box sx={{ mt: 'auto', pt: 1 }}>
              {isMatch ? (
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<ChatBubbleOutline />}
                  onClick={() => handleChatClick(item.matchId || cat.id)}
                >
                  Chat
                </Button>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    startIcon={<FavoriteBorder />}
                    disabled
                  >
                    Liked
                  </Button>
                </Box>
              )}
            </Box>
          </CardContent>
        </StyledCard>
      </Grid>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => {
            loadMatches();
            loadLikedCats();
          }}
        >
          Retry
        </Button>
      </Container>
    );
  }

  const hasMatches = matches && matches.length > 0;
  const hasLikedCats = likedCats && likedCats.length > 0;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Matches & Likes
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Connect with other cat lovers and start chatting with your matches
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          aria-label="matches tabs"
          centered
        >
          <Tab label={`Matches (${hasMatches ? matches.length : 0})`} {...a11yProps(0)} />
          <Tab label={`Liked Cats (${hasLikedCats ? likedCats.length : 0})`} {...a11yProps(1)} />
        </Tabs>
      </Box>

      <TabPanel value={activeTab} index={0}>
        {hasMatches ? (
          <Grid container spacing={3}>
            {matches.map((match) => renderCatCard(match, true))}
          </Grid>
        ) : (
          <Box textAlign="center" py={6}>
            <Pets sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No matches yet
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Keep swiping to find your purr-fect match!
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => navigate('/swipe')}
              startIcon={<Favorite />}
            >
              Start Swiping
            </Button>
          </Box>
        )}
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        {hasLikedCats ? (
          <Grid container spacing={3}>
            {likedCats.map((cat) => renderCatCard(cat))}
          </Grid>
        ) : (
          <Box textAlign="center" py={6}>
            <Pets sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No liked cats yet
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Swipe right on cats you like to see them here!
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => navigate('/swipe')}
              startIcon={<Favorite />}
            >
              Start Swiping
            </Button>
          </Box>
        )}
      </TabPanel>
    </Container>
  );
}