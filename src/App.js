import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Box, CssBaseline } from '@mui/material';
import { Routes, Route, useLocation } from 'react-router-dom';

// Pages
import HomePage from './pages/HomePage';
import SwipePage from './pages/SwipePage';
import MatchesPage from './pages/MatchesPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import About from './pages/AboutPage';
import Blog from './pages/BlogPage';
import FAQ from './pages/FaqPage';
import ChatPage from './pages/ChatPage';

// Context Providers
import { CatProvider } from './context/CatContext';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/PrivateRoute';

// Custom hook for page transitions
function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/faq" element={<FAQ />} />
        <Route
          path="/swipe"
          element={
            <PrivateRoute>
              <SwipePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/matches"
          element={
            <PrivateRoute>
              <MatchesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat/:matchId"
          element={
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <CatProvider>
        <ChatProvider>
          <CssBaseline />
          <Box
            sx={{
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              background: 'linear-gradient(135deg, #FFF5F5 0%, #F0FFF4 100%)',
            }}
          >
            <Navbar />
            <Box component="main" sx={{ flex: 1, py: 3, px: { xs: 2, sm: 3 } }}>
              <AnimatedRoutes />
            </Box>
            <Footer />
          </Box>
        </ChatProvider>
      </CatProvider>
    </AuthProvider>
  );
}

export default App;
