import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Avatar,
  Card,
  CardMedia,
  CircularProgress,
  useTheme,
  styled
} from '@mui/material';
import { 
  Close as NopeIcon, 
  Favorite as LikeIcon, 
  FlashOn as SuperLikeIcon,
  Replay as RewindIcon
} from '@mui/icons-material';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useCats } from '../context/CatContext';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';

// Sample cat images from Tumblr
const CAT_IMAGES = [
  'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3NjFmcnQ2MGVydTVjanIzbjM3MjViOWMzc2Njcmp6aHVzMzg3eHAzdyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/nUQm3AirLKdRBq1yhv/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3YjYyczU2Ymw4azlqemFvaXFncWg0NHp2c2FucnNkejAwM2ZtcjVrdyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/WWyT3VgEgIK8U/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3YjYyczU2Ymw4azlqemFvaXFncWg0NHp2c2FucnNkejAwM2ZtcjVrdyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/JwW4oYd3Wjv6E/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzV4aW81bW1tcXJpdThhM2Fjcm56b2Ntb2oxd2R3cXdhcW5kZWVqNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/VOPK1BqsMEJRS/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3YjYyczU2Ymw4azlqemFvaXFncWg0NHp2c2FucnNkejAwM2ZtcjVrdyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/CqVNwrLt9KEDK/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3bmEzbW1yaWdtdHpubGY2aW9wZmk3bjgwM2NyZHZoY2c1Z3lqN2t1NCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/6C4y1oxC6182MsyjvK/giphy.gif'
];

const ActionButton = styled(IconButton)(({ theme, color }) => ({
  width: 60,
  height: 60,
  margin: '0 12px',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
  '&:hover': {
    backgroundColor: theme.palette.grey[200],
    transform: 'scale(1.1)',
  },
  '&.like': {
    color: theme.palette.success.main,
    border: `2px solid ${theme.palette.success.main}`,
  },
  '&.super-like': {
    color: theme.palette.info.main,
    border: `2px solid ${theme.palette.info.main}`,
  },
  '&.nope': {
    color: theme.palette.error.main,
    border: `2px solid ${theme.palette.error.main}`,
  },
  transition: 'all 0.2s ease-in-out',
}));

const CarouselContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '65vh',
  maxHeight: '600px',
  position: 'relative',
  borderRadius: '24px',
  overflow: 'hidden',
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  marginBottom: theme.spacing(2),
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
    zIndex: 2,
    pointerEvents: 'none',
  },
  [theme.breakpoints.down('sm')]: {
    height: '55vh',
    borderRadius: '16px',
  },
}));

const MediaCounter = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 16,
  right: 16,
  backgroundColor: 'rgba(0,0,0,0.6)',
  color: 'white',
  padding: '4px 12px',
  borderRadius: '12px',
  fontSize: '0.875rem',
  zIndex: 3,
}));

const CatInfo = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(3),
  color: 'white',
  zIndex: 3,
  textShadow: '0 1px 3px rgba(0,0,0,0.5)',
  '& h4': {
    margin: 0,
    fontSize: '1.75rem',
    fontWeight: 700,
    lineHeight: 1.2,
  },
  '& p': {
    margin: '4px 0 0',
    opacity: 0.9,
    fontSize: '1rem',
  },
}));

const SwipePage = () => {
  const { 
    availableCats, 
    currentCat, 
    setCurrentCat, 
    likeCat, 
    loadAvailableCats,
    loadCats,
    catsLoading,
    matches,
    dislikeCat,
  } = useCats();
  
  const { currentUser } = useAuth();
  const { startChat } = useChat();
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log('[SwipePage] Current cat updated:', currentCat);
  }, [currentCat]);

  useEffect(() => {
    console.log('[SwipePage] Available cats updated:', availableCats);
  }, [availableCats]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatchDialog, setShowMatchDialog] = useState(false);
  const [matchedCat, setMatchedCat] = useState(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [exitX, setExitX] = useState(0);
  const [exitY, setExitY] = useState(0);
  const [direction, setDirection] = useState('');
  const [imageLoading, setImageLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoSlide, setAutoSlide] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const slideInterval = useRef(null);
  const carouselRef = useRef(null);
  const cardRefs = useRef([]);

  // Ensure we have a cat to display
  useEffect(() => {
    console.log('[SwipePage] Available cats:', availableCats);
    console.log('[SwipePage] Current cat:', currentCat);
    console.log('[SwipePage] Loading:', catsLoading);
    
    if ((!availableCats || availableCats.length === 0) && !catsLoading) {
      console.log('[SwipePage] No cats available, loading more...');
      loadAvailableCats();
    }
  }, [availableCats, catsLoading, loadAvailableCats]);

  useEffect(() => {
    console.log('[SwipePage] Effect - availableCats:', availableCats);
    console.log('[SwipePage] Effect - currentCat:', currentCat);
    
    if (availableCats && availableCats.length > 0 && !currentCat) {
      console.log('[SwipePage] Setting first available cat as current');
      setCurrentCat(availableCats[0]);
    } else if (availableCats && availableCats.length === 0 && !catsLoading) {
      // No more cats available and not loading
      console.log('[SwipePage] No more cats available');
      setCurrentCat(null);
    }
  }, [availableCats, currentCat, catsLoading]);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = (e) => {
    console.warn('Image failed to load, using fallback:', e.target.src);
    // Use a fallback image from our predefined list
    const fallbackImage = CAT_IMAGES[Math.floor(Math.random() * CAT_IMAGES.length)];
    
    // Only update if we haven't already tried to load this fallback
    if (e.target.src !== fallbackImage) {
      e.target.src = fallbackImage;
    } else {
      // If fallback also fails, try another one
      const nextFallback = CAT_IMAGES.find(img => img !== fallbackImage) || CAT_IMAGES[0];
      e.target.src = nextFallback;
    }
    
    setImageLoading(false);
  };

  const handleSwipeAction = async (direction) => {
    if (!currentCat || !availableCats || availableCats.length === 0) {
      console.log('No cat to swipe or no more cats available');
      return;
    }
    
    setIsSwiping(true);
    setDirection(direction);
    
    // Set exit animation based on direction
    if (direction === 'right') {
      setExitX(1000);
      setExitY(0);
    } else if (direction === 'left') {
      setExitX(-1000);
      setExitY(0);
    } else if (direction === 'up') {
      setExitX(0);
      setExitY(-1000);
    }
    
    try {
      // Call the appropriate action based on swipe direction
      if (direction === 'right') {
        await likeCat(currentCat.id);
      } else if (direction === 'left') {
        await dislikeCat(currentCat.id);
      } else if (direction === 'up') {
        await likeCat(currentCat.id); // Treat upswipe as a super like
      }
      
      // Move to next cat if available
      const currentCatIndex = availableCats.findIndex(cat => cat.id === currentCat.id);
      if (currentCatIndex === -1) {
        console.log('Current cat not found in availableCats');
        return;
      }
      
      const nextIndex = (currentCatIndex + 1) % availableCats.length;
      
      // If we've reached the end of the list
      if (nextIndex <= currentCatIndex) {
        // If we've gone through all cats, try to load more
        await loadAvailableCats();
      } else {
        // Otherwise, show the next cat
        setCurrentCat(availableCats[nextIndex]);
      }
      
    } catch (error) {
      console.error('Error handling swipe action:', error);
      // Reset the current cat to the first one if something goes wrong
      if (availableCats.length > 0) {
        setCurrentCat(availableCats[0]);
      }
    } finally {
      setIsSwiping(false);
      setImageLoading(true); // Reset image loading state for the next cat
    }
  };

  const handleMessageMatch = () => {
    if (!matchedCat) return;
    
    // Create a match object that includes both users
    const match = {
      id: `${currentUser.uid}_${matchedCat.userId}`,
      users: [
        { id: currentUser.uid, ...currentUser },
        { id: matchedCat.userId, ...matchedCat }
      ],
      lastMessage: null,
      unreadCount: 0,
      timestamp: new Date().toISOString()
    };
    
    // Start chat with the matched cat
    startChat(match);
    
    // Navigate to matches tab
    navigate('/matches');
    
    // Close the dialog
    setShowMatchDialog(false);
  };

  const renderMedia = (media, index) => {
    if (!media) return null;
    
    const isVideo = typeof media === 'string' && 
                   (media.endsWith('.mp4') || media.includes('/video/'));
    
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8f9fa',
        }}
      >
        {isVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            onError={handleMediaError}
          >
            <source src={media} type="video/mp4" />
          </video>
        ) : (
          <img
            src={media}
            alt={`${currentCat?.name || 'Cat'} ${index + 1}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            onError={handleMediaError}
          />
        )}
      </Box>
    );
  };

  const handleMediaError = (e) => {
    const fallbackImg = e.target.tagName === 'IMG' ? e.target : e.target.parentNode.querySelector('img');
    if (fallbackImg) {
      fallbackImg.src = CAT_IMAGES[Math.floor(Math.random() * CAT_IMAGES.length)];
      fallbackImg.style.display = 'block';
      e.target.style.display = 'none';
    }
  };

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const scrollPosition = carouselRef.current.scrollLeft;
    const slideWidth = carouselRef.current.offsetWidth;
    const slideIndex = Math.round(scrollPosition / slideWidth);
    setCurrentSlide(slideIndex);
  };

  useEffect(() => {
    if (!autoSlide || isHovered) return;
    
    const mediaArray = [
      ...(currentCat?.photos || []),
      ...(currentCat?.video ? [currentCat.video] : [])
    ].filter(Boolean);
    
    if (mediaArray.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % mediaArray.length);
      if (carouselRef.current) {
        carouselRef.current.scrollTo({
          left: (currentSlide + 1) * carouselRef.current.offsetWidth,
          behavior: 'smooth'
        });
      }
    }, 3000); // Change slide every 3 seconds
    
    return () => clearInterval(interval);
  }, [autoSlide, isHovered, currentCat, currentSlide]);

  const NoMoreCats = () => (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: '60vh',
        textAlign: 'center',
        p: 3
      }}
    >
      <Typography variant="h5" gutterBottom>
        😿 No more cats in your area!
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Check back later or adjust your search preferences to see more furry friends.
      </Typography>
      <Button 
        variant="contained" 
        color="primary"
        onClick={loadCats}
        startIcon={<RewindIcon />}
      >
        Refresh Cats
      </Button>
    </Box>
  );

  if ((!availableCats || availableCats.length === 0) && !catsLoading) {
    return <NoMoreCats />;
  }

  if (catsLoading || !currentCat) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  const currentCatData = availableCats[currentIndex];
  const imageUrl = currentCatData?.image || CAT_IMAGES[currentIndex % CAT_IMAGES.length];

  return (
    <Box sx={{ 
      position: 'relative',
      height: '100vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      pt: 2,
    }}>
      {catsLoading && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress />
        </Box>
      )}

      {!catsLoading && currentCatData && (
        <Box sx={{ 
          position: 'relative',
          width: '100%',
          maxWidth: 400,
          height: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          p: 2,
        }}>
          <CarouselContainer 
            onMouseEnter={() => {
              setIsHovered(true);
              setAutoSlide(false);
            }}
            onMouseLeave={() => {
              setIsHovered(false);
              setAutoSlide(true);
            }}
          >
            <Box 
              ref={carouselRef}
              sx={{
                display: 'flex',
                width: '100%',
                height: '100%',
                overflowX: 'auto',
                scrollSnapType: 'x mandatory',
                '&::-webkit-scrollbar': { display: 'none' },
                scrollbarWidth: 'none',
                scrollBehavior: 'smooth',
              }}
              onScroll={handleScroll}
            >
              {[
                ...(currentCatData?.photos || []),
                ...(currentCatData?.video ? [currentCatData.video] : [])
              ]
              .filter(Boolean)
              .map((media, index, array) => (
                <Box 
                  key={index}
                  sx={{
                    flex: '0 0 100%',
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    scrollSnapAlign: 'start',
                  }}
                >
                  {renderMedia(media, index)}
                  {array.length > 1 && (
                    <MediaCounter>
                      {index + 1} / {array.length}
                    </MediaCounter>
                  )}
                  
                  {/* Add navigation dots */}
                  {array.length > 1 && (
                    <Box sx={{
                      position: 'absolute',
                      bottom: 24,
                      left: 0,
                      right: 0,
                      display: 'flex',
                      justifyContent: 'center',
                      gap: 1,
                      zIndex: 4,
                    }}>
                      {array.map((_, i) => (
                        <Box 
                          key={i}
                          onClick={() => {
                            setCurrentSlide(i);
                            if (carouselRef.current) {
                              carouselRef.current.scrollTo({
                                left: i * carouselRef.current.offsetWidth,
                                behavior: 'smooth'
                              });
                            }
                          }}
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: i === currentSlide ? 'white' : 'rgba(255,255,255,0.5)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              transform: 'scale(1.2)'
                            }
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
            
            <CatInfo>
              <h4>{currentCatData?.name}, {currentCatData?.age}</h4>
              {currentCatData?.breed && <p>{currentCatData.breed}</p>}
              {currentCatData?.bio && <p>{currentCatData.bio}</p>}
            </CatInfo>
          </CarouselContainer>

          {/* Action Buttons */}
          <Box sx={{ 
            position: 'fixed', 
            bottom: 20, 
            left: 0, 
            right: 0, 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 4,
            px: 2,
          }}>
            <ActionButton 
              className="nope" 
              onClick={() => handleSwipeAction('left')}
              disabled={isSwiping}
              sx={{ 
                width: 60, 
                height: 60,
                bgcolor: 'white',
                boxShadow: 3,
                '&:hover': {
                  bgcolor: 'grey.100',
                }
              }}
            >
              <NopeIcon fontSize="large" />
            </ActionButton>
            <ActionButton 
              className="like" 
              onClick={() => handleSwipeAction('right')}
              disabled={isSwiping}
              sx={{ 
                width: 60, 
                height: 60,
                bgcolor: 'white',
                boxShadow: 3,
                '&:hover': {
                  bgcolor: 'grey.100',
                }
              }}
            >
              <LikeIcon fontSize="large" />
            </ActionButton>
          </Box>
        </Box>
      )}
      
      {/* Match Dialog */}
      <Dialog
        open={showMatchDialog}
        onClose={() => setShowMatchDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="h4" color="primary" gutterBottom>
            It's a Match! 😻
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            You and {matchedCat?.name || 'this cat'} have liked each other.
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 4 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Avatar 
                src={currentUser?.photoURL} 
                sx={{ width: 100, height: 100, mb: 1, mx: 'auto' }}
              />
              <Typography variant="body2">You</Typography>
            </Box>
            
            <Box sx={{ textAlign: 'center' }}>
              <Avatar 
                src={matchedCat?.photoURL} 
                sx={{ width: 100, height: 100, mb: 1, mx: 'auto' }}
              />
              <Typography variant="body2">{matchedCat?.name || 'Your Match'}</Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              onClick={() => setShowMatchDialog(false)}
              sx={{ 
                textTransform: 'none',
                borderRadius: 2,
                px: 3,
                py: 1
              }}
            >
              Keep Swiping
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleMessageMatch}
              sx={{ 
                textTransform: 'none',
                borderRadius: 2,
                px: 3,
                py: 1
              }}
            >
              Send Message
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default SwipePage;
