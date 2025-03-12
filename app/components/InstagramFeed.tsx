'use client';

import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardMedia, CardContent, Box } from '@mui/material';
import { motion } from 'framer-motion';

const InstagramFeed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Replace 'YOUR_INSTAGRAM_API_URL' with your actual Instagram API endpoint
    fetch('YOUR_INSTAGRAM_API_URL')
      .then(response => response.json())
      .then(data => {
        setPosts(data.posts); // Adjust the key based on API response
      })
      .catch(error => console.error('Error fetching Instagram feed:', error));
  }, []);

  return (
    <Box sx={{ position: 'relative', py: 12, px: 4, background: 'linear-gradient(135deg, #f3f3f3, #ffffff)' }}>
      <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
              fontWeight: 'bold',
              color: '#333',
              textShadow: '2px 2px 6px rgba(0,0,0,0.1)',
              mb: 4,
            }}
          >
            Instagram Feed
          </Typography>
        </motion.div>
        <Grid container spacing={4} sx={{ display: 'flex', justifyContent: 'center' }}>
          {posts.map((post, index) => (
            <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Card
                  sx={{
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: 10,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': { transform: 'translateY(-10px)', boxShadow: 16 },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="240"
                    image={post.image} // Assuming API response has an image key
                    alt="Instagram Post"
                  />
                  <CardContent sx={{ textAlign: 'center', background: 'rgba(255, 255, 255, 0.9)' }}>
                    <Typography variant="body2" color="text.secondary">
                      {post.caption.length > 100 ? post.caption.substring(0, 100) + '...' : post.caption}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default InstagramFeed;
