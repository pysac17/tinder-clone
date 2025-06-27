import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProfileCompleteRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  // If user is not logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If profile is not complete, redirect to profile page
  if (!currentUser.profileComplete) {
    // Only redirect if not already on the profile page to avoid infinite loop
    if (location.pathname !== '/profile') {
      return <Navigate to="/profile" state={{ from: location, requireProfileComplete: true }} replace />;
    }
  }

  // If profile is complete or already on profile page, render children
  return children;
};

export default ProfileCompleteRoute;
