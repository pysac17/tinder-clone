import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

// Mock data for development
const MOCK_CATS = [
  {
    id: '1',
    name: 'Whiskers',
    age: 2,
    breed: 'Tabby',
    image: 'https://placekitten.com/300/300',
    bio: 'Loves to cuddle and play with yarn',
  },
  {
    id: '2',
    name: 'Mittens',
    age: 3,
    breed: 'Siamese',
    image: 'https://placekitten.com/301/301',
    bio: 'Enjoys sunny spots and long naps',
  },
];

const CatContext = createContext();

export const CatProvider = ({ children }) => {
  const [availableCats, setAvailableCats] = useState([]);
  const [matches, setMatches] = useState([]);
  const [chats, setChats] = useState({});
  const [currentCat, setCurrentCat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const [likedCats, setLikedCats] = useState([]);
  const [usingMockData, setUsingMockData] = useState(false);
  const [catDetails, setCatDetails] = useState({});
  const [loadingDetails, setLoadingDetails] = useState({});

  // Load matches from the matches table only
  const loadMatches = useCallback(async () => {
    if (!currentUser?.uid) {
      setMatches([]);
      return [];
    }

    try {
      setLoading(true);
      setError(null);
      
      // Get matches from the matches table only
      const matchesData = await api.getMatches();
      
      if (matchesData && matchesData.success && Array.isArray(matchesData.matches)) {
        // Process matches to get unique cats
        const uniqueCats = [];
        const seenCatIds = new Set();
        
        matchesData.matches.forEach(match => {
          if (match.cat && match.cat.id && !seenCatIds.has(match.cat.id)) {
            seenCatIds.add(match.cat.id);
            uniqueCats.push({
              ...match.cat,
              // Ensure all required fields have fallbacks
              name: match.cat.name || 'Unknown Cat',
              age: match.cat.age || 1,
              breed: match.cat.breed || 'Mixed',
              image: match.cat.image || match.cat.photoURL || 'https://placekitten.com/300/300',
              bio: match.cat.bio || 'A lovely cat looking for a friend',
              // Add match specific data
              matchedAt: match.matchedAt,
              matchId: match.matchId
            });
          }
        });
        
        setMatches(uniqueCats);
        return uniqueCats;
      } else {
        console.warn('Invalid matches data format:', matchesData);
        setMatches([]);
        return [];
      }
    } catch (error) {
      console.error('Error loading matches:', error);
      toast.error('Failed to load matches');
      setMatches([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [currentUser?.uid]);

  // Load available cats for swiping (only non-matched cats)
  const loadAvailableCats = useCallback(async () => {
    if (!currentUser?.uid) {
      setAvailableCats([]);
      return [];
    }

    try {
      setLoading(true);
      setError(null);
      
      // First get all cats
      const response = await api.getCats();
      
      if (response && response.success && Array.isArray(response.cats)) {
        // Get current matches to filter them out
        const currentMatches = await loadMatches();
        const matchedCatIds = new Set(currentMatches.map(match => match.id));
        
        // Filter out matched cats and invalid entries
        const validCats = [];
        const seenUserIds = new Set();
        
        response.cats.forEach(cat => {
          // Skip invalid cats
          if (!cat || !cat.id || !cat.userId) {
            console.warn('Invalid cat object:', cat);
            return;
          }
          
          // Skip matched cats
          if (matchedCatIds.has(cat.id)) {
            console.log('Skipping matched cat:', cat.id);
            return;
          }
          
          // Skip duplicates (same user)
          if (seenUserIds.has(cat.userId)) {
            console.log('Skipping duplicate profile for user:', cat.userId);
            return;
          }
          
          seenUserIds.add(cat.userId);
          
          // Add required fields with fallbacks
          validCats.push({
            ...cat,
            name: cat.name || 'Unknown Cat',
            age: cat.age || 1,
            breed: cat.breed || 'Mixed',
            image: cat.image || cat.photoURL || 'https://placekitten.com/300/300',
            bio: cat.bio || 'A lovely cat looking for a friend'
          });
        });
        
        console.log(`[CatContext] Setting ${validCats.length} available cats`);
        setAvailableCats(validCats);
        
        // Set the first cat as current if not set
        if (validCats.length > 0 && !currentCat) {
          setCurrentCat(validCats[0]);
        }
        
        return validCats;
      } else {
        const message = response?.message || 'No more cats available right now';
        toast.info(message);
        setAvailableCats([]);
        return [];
      }
    } catch (error) {
      console.error('Error loading available cats:', error);
      toast.error('Failed to load cats. Please try again later.');
      setAvailableCats([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [currentUser?.uid, currentCat, loadMatches]);

  // Load liked cats with fallback to matches
  const loadLikedCats = useCallback(async () => {
    if (!currentUser?.uid) {
      setLikedCats([]);
      return [];
    }

    try {
      setLoading(true);
      setError(null);
      
      let likedCatsData = [];
      
      // Try to use the matches endpoint as fallback
      try {
        const matchesData = await loadMatches();
        likedCatsData = Array.isArray(matchesData) 
          ? matchesData.filter(match => match.isMatch) 
          : [];
      } catch (error) {
        console.warn('Error loading matches for liked cats:', error);
      }
      
      setLikedCats(likedCatsData);
      return likedCatsData;
    } catch (error) {
      console.warn('Error loading liked cats:', error);
      setLikedCats([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [currentUser?.uid, loadMatches]);

  // Update the likeCat function to properly handle the API response
  const likeCat = useCallback(async (catId) => {
    if (!currentUser?.uid) {
      toast.error('Please sign in to like cats');
      return false;
    }

    try {
      setLoading(true);
      
      // Find the cat being liked
      const catToLike = availableCats.find(cat => cat.id === catId);
      if (!catToLike) {
        toast.error('Cat not found');
        return false;
      }

      // Call the API to record the swipe
      const result = await api.swipe(catId, true);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to record swipe');
      }

      // Update local state
      setAvailableCats(prev => prev.filter(cat => cat.id !== catId));
      
      // If it's a match, show a message
      if (result.isMatch) {
        const matchedCat = availableCats.find(cat => cat.id === catId);
        if (matchedCat) {
          toast.success(`It's a match with ${matchedCat.name}! 🎉`);
        }
        // Refresh matches
        await loadMatches();
      } else {
        toast.success(`You liked ${catToLike.name}!`);
      }

      return true;
    } catch (error) {
      console.error('Error liking cat:', error);
      toast.error(error.message || 'Failed to like cat. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentUser?.uid, availableCats, loadMatches]);

  // Update the dislikeCat function
  const dislikeCat = useCallback(async (catId) => {
    if (!currentUser?.uid) {
      toast.error('Please sign in to dislike cats');
      return false;
    }

    try {
      setLoading(true);
      
      // Call the API to record the swipe
      const result = await api.swipe(catId, false);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to record swipe');
      }

      // Update local state
      setAvailableCats(prev => prev.filter(cat => cat.id !== catId));
      return true;
    } catch (error) {
      console.error('Error disliking cat:', error);
      toast.error(error.message || 'Failed to dislike cat. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentUser?.uid]);

  // Function to load cat details by ID
  const loadCatDetails = useCallback(async (catId) => {
    if (!catId || catDetails[catId]) return catDetails[catId];

    try {
      setLoadingDetails(prev => ({ ...prev, [catId]: true }));
      const response = await api.getCatById(catId);
      if (response?.success && response.cat) {
        setCatDetails(prev => ({
          ...prev,
          [catId]: response.cat
        }));
        return response.cat;
      }
      return null;
    } catch (error) {
      console.error('Error loading cat details:', error);
      return null;
    } finally {
      setLoadingDetails(prev => ({ ...prev, [catId]: false }));
    }
  }, [catDetails]);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      if (!currentUser?.uid) return;
      
      try {
        await Promise.all([
          loadAvailableCats(),
          loadMatches(),
          loadLikedCats()
        ]);
      } catch (error) {
        console.warn('Error loading initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentUser?.uid, loadAvailableCats, loadMatches, loadLikedCats]);

  const contextValue = {
    availableCats,
    matches,
    chats,
    currentCat,
    likedCats,
    loading,
    error,
    usingMockData,
    loadMatches,
    loadAvailableCats,
    loadLikedCats,
    likeCat,
    dislikeCat,
    setCurrentCat,
    catDetails,
    loadingDetails,
    loadCatDetails,
  };

  return (
    <CatContext.Provider value={contextValue}>
      {children}
    </CatContext.Provider>
  );
};

export const useCats = () => {
  const context = useContext(CatContext);
  if (context === undefined) {
    throw new Error('useCats must be used within a CatProvider');
  }
  return context;
};

export default CatContext;