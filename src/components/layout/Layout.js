import React from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 8, // Adjust this value based on your Navbar height
          px: { xs: 2, sm: 3, md: 4 },
          pb: 4,
          width: '100%',
          maxWidth: '1200px',
          mx: 'auto',
        }}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;