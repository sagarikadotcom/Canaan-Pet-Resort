import { Box, Container, Grid, Typography } from '@mui/material'
import Link from 'next/link';
import React from 'react'
const navLinks = [
    { title: 'Home', path: '/' },
    { title: 'About', path: '/about' },
    { title: 'Projects', path: '/projects' },
    { title: 'Team', path: '/team' },
    { title: 'News', path: '/news' },
    { title: 'Contact', path: '/contact' }
  ];

const Footer =()=>{
    return(
        <Box sx={{ background: '#333', color: 'white', py: 4, mt: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight="bold">About Us</Typography>
              <Typography variant="body2">Providing premium pet services with love and care.</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight="bold">Quick Links</Typography>
              {navLinks.map((item, index) => (
                <Typography key={index} variant="body2">
                  <Link href={item.path} color="inherit" style={{ textDecoration: 'none' }}>{item.title}</Link>
                </Typography>
              ))}
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight="bold">Contact</Typography>
              <Typography variant="body2">Email: hello@canaanpetresort.com</Typography>
              <Typography variant="body2">Phone: +918951133804</Typography>
            </Grid>
          </Grid>
          <Typography variant="body2" align="center" mt={3}>
            © {new Date().getFullYear()} Canaan Pet Resort & K9 Academy. All Rights Reserved.
          </Typography>
        </Container>
      </Box>
    )
}

export default Footer