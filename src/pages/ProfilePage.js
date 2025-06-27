import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Container,
  Card,
  CardMedia,
  IconButton,
  CircularProgress,
  useTheme
} from '@mui/material';
import { 
  Edit, 
  Save, 
  ArrowBack, 
  CameraAlt as CameraAltIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useCats } from '../context/CatContext';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { currentUser: authUser } = useAuth();
  const { 
    currentUser: catProfile, 
    updateCatProfile, 
    loading, 
    getCurrentUserCatProfile,
    api // Get api from CatContext
  } = useCats();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    breed: '',
    bio: '',
    photos: []
  });
  const navigate = useNavigate();
  const theme = useTheme();

  // Load cat profile when component mounts or when catProfile changes
  useEffect(() => {
    const loadProfile = async () => {
      const profile = await getCurrentUserCatProfile();
      if (profile) {
        setFormData(prev => ({
          ...prev,
          ...profile,
          photos: Array.isArray(profile.photos) ? profile.photos : []
        }));
      }
    };
    
    loadProfile();
  }, [getCurrentUserCatProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const response = await api.uploadFile(file);
      if (response.url) {
        setFormData(prev => ({
          ...prev,
          photos: [...prev.photos, response.url]
        }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      // Reset the file input
      e.target.value = null;
    }
  };

  const handleRemovePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSaveProfile = async () => {
    try {
      await updateCatProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" mb={4}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1">
          {isEditing ? 'Edit Profile' : 'My Profile'}
        </Typography>
        <Box flexGrow={1} />
        {!isEditing ? (
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<Edit />}
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </Button>
        ) : (
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<Save />}
            onClick={handleSaveProfile}
          >
            Save
          </Button>
        )}
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            {formData.name}
          </Typography>
          <Typography color="textSecondary">
            {formData.age} years old • {formData.breed}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2, mb: 4 }}>
          {formData.photos.map((photo, index) => (
            <Box key={index} sx={{ position: 'relative' }}>
              <CardMedia
                component="img"
                image={photo}
                alt={`Cat photo ${index + 1}`}
                sx={{ width: 200, height: 200, borderRadius: 2, objectFit: 'cover' }}
              />
              {isEditing && (
                <IconButton
                  onClick={() => handleRemovePhoto(index)}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    color: 'white',
                    bgcolor: 'rgba(0,0,0,0.5)',
                    '&:hover': {
                      bgcolor: 'rgba(0,0,0,0.7)'
                    }
                  }}
                >
                  <CloseIcon />
                </IconButton>
              )}
            </Box>
          ))}
          {isEditing && (
            <label htmlFor="upload-photo">
              <Card
                sx={{
                  width: 200,
                  height: 200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: '2px dashed grey',
                  borderRadius: 2,
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <CameraAltIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                <input
                  type="file"
                  id="upload-photo"
                  accept="image/*"
                  hidden
                  onChange={handleImageUpload}
                />
              </Card>
            </label>
          )}
        </Box>

        <TextField
          fullWidth
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          disabled={!isEditing}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Age"
          name="age"
          type="number"
          value={formData.age}
          onChange={handleInputChange}
          disabled={!isEditing}
          sx={{ mb: 2 }}
          inputProps={{ min: 0, max: 30 }}
        />

        <TextField
          fullWidth
          label="Breed"
          name="breed"
          value={formData.breed}
          onChange={handleInputChange}
          disabled={!isEditing}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Bio"
          name="bio"
          multiline
          rows={4}
          value={formData.bio}
          onChange={handleInputChange}
          disabled={!isEditing}
          sx={{ mb: 2 }}
          placeholder="Tell us about your cat..."
        />
      </Box>
    </Container>
  );
};

export default ProfilePage;
