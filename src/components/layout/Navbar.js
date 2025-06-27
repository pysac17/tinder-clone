import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Avatar,
  Badge,
  Box,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  useMediaQuery,
  Tooltip,
  CircularProgress
} from '@mui/material';
import { 
  Favorite as FavoriteIcon, 
  Chat as ChatIcon,
  Menu as MenuIcon,
  Home as HomeIcon,
  Pets as PetsIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useCats } from '../../context/CatContext';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { currentUser, logout } = useAuth();
  const { matches: catMatches } = useCats() || { matches: [] };
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    } finally {
      setIsLoggingOut(false);
      handleMenuClose();
    }
  };

  const navItems = [
    { label: 'Home', path: '/', icon: <HomeIcon /> },
    { label: 'Swipe', path: '/swipe', icon: <PetsIcon /> },
    { 
      label: 'Matches', 
      path: '/matches', 
      icon: (
        <Badge 
          badgeContent={catMatches.length} 
          color="error" 
          max={99}
          overlap="circular"
        >
          <FavoriteIcon />
        </Badge>
      )
    },
  ];

  const menuId = 'primary-account-menu';
  const mobileMenuId = 'primary-account-menu-mobile';
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <Divider />
      <MenuItem onClick={handleLogout} disabled={isLoggingOut}>
        {isLoggingOut ? (
          <CircularProgress size={24} sx={{ mr: 1 }} />
        ) : (
          <LogoutIcon sx={{ mr: 1 }} />
        )}
        Logout
      </MenuItem>
    </Menu>
  );

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {navItems.map((item) => (
        <MenuItem 
          key={item.path}
          component={RouterLink}
          to={item.path}
          onClick={handleMobileMenuClose}
          selected={location.pathname === item.path}
        >
          {React.cloneElement(item.icon, { sx: { mr: 1 } })}
          {item.label}
          {item.path === '/matches' && catMatches.length > 0 && (
            <Box component="span" sx={{ ml: 'auto' }}>
              <Badge 
                badgeContent={catMatches.length} 
                color="error" 
                sx={{ ml: 1 }}
              />
            </Box>
          )}
        </MenuItem>
      ))}
    </Menu>
  );

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <PetsIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
          <Typography 
            variant="h6" 
            component={RouterLink} 
            to="/" 
            sx={{ 
              textDecoration: 'none', 
              color: 'inherit',
              fontWeight: 'bold',
              '&:hover': {
                color: theme.palette.primary.main,
              },
            }}
          >
            Cat-Tinder
          </Typography>
        </Box>

        {currentUser ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {!isMobile ? (
              <>
                {navItems.map((item) => (
                  <Tooltip key={item.path} title={item.label} arrow>
                    <IconButton
                      component={RouterLink}
                      to={item.path}
                      color={location.pathname === item.path ? 'primary' : 'default'}
                      sx={{ 
                        mx: 0.5,
                        '&.Mui-selected': {
                          color: 'primary.main',
                          borderBottom: '2px solid',
                          borderColor: 'primary.main',
                          borderRadius: 0
                        }
                      }}
                    >
                      {item.icon}
                    </IconButton>
                  </Tooltip>
                ))}
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                  sx={{ ml: 1 }}
                >
                  <Avatar 
                    src={currentUser.photoURL || '/default-avatar.png'} 
                    alt={currentUser.displayName || 'User'}
                    sx={{ width: 32, height: 32 }}
                  />
                </IconButton>
              </>
            ) : (
              <>
                <IconButton
                  aria-label="show more"
                  aria-controls={mobileMenuId}
                  aria-haspopup="true"
                  onClick={handleMobileMenuOpen}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                  sx={{ ml: 1 }}
                >
                  <Avatar 
                    src={currentUser.photoURL || '/default-avatar.png'} 
                    alt={currentUser.displayName || 'User'}
                    sx={{ width: 32, height: 32 }}
                  />
                </IconButton>
              </>
            )}
          </Box>
        ) : (
          <Box>
            <Button 
              component={RouterLink} 
              to="/login" 
              color="inherit"
              sx={{ mr: 1 }}
            >
              Login
            </Button>
            <Button 
              component={RouterLink} 
              to="/signup" 
              variant="contained" 
              color="primary"
              sx={{ borderRadius: 2 }}
            >
              Sign Up
            </Button>
          </Box>
        )}
      </Toolbar>
      {renderMenu}
      {renderMobileMenu}
    </AppBar>
  );
};

export default Navbar;