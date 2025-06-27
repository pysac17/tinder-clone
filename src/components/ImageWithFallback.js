import React, { useState, useEffect } from 'react';
import { Box, Skeleton } from '@mui/material';

const ImageWithFallback = ({
  src,
  alt,
  fallbackSrc = 'https://placekitten.com/400/400',
  width = '100%',
  height = '100%',
  objectFit = 'cover',
  borderRadius = 0,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Reset states when src changes
    setImgSrc(src);
    setIsLoading(true);
    setHasError(false);
    
    // Preload the image
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setIsLoading(false);
    };
    
    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
      setImgSrc(fallbackSrc);
    };
    
    return () => {
      // Cleanup
      img.onload = null;
      img.onerror = null;
    };
  }, [src, fallbackSrc]);

  // Show skeleton while loading
  if (isLoading) {
    return (
      <Skeleton 
        variant="rectangular" 
        width={width} 
        height={height} 
        sx={{ 
          borderRadius,
          bgcolor: 'grey.200'
        }} 
      />
    );
  }


  return (
    <Box
      component="img"
      src={hasError ? fallbackSrc : imgSrc}
      alt={alt}
      onError={() => {
        if (!hasError) {
          setHasError(true);
          setImgSrc(fallbackSrc);
        }
      }}
      sx={{
        width,
        height,
        objectFit,
        borderRadius,
        transition: 'opacity 0.3s ease-in-out',
        opacity: isLoading ? 0 : 1,
        ...props.sx
      }}
      {...props}
    />
  );
};

export default ImageWithFallback;
