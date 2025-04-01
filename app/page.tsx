'use client';

import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, Box, Container, Typography, Grid, Link } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Services from './components/Services';
import ContactUs from './components/ContactUs';
import { useRouter } from 'next/navigation';

const navLinks = [
  { title: 'Home', path: '#home' },
  { title: 'Services', path: '#services' },
  { title: 'Get in Touch', path: '#contact' },
  { title: 'Login', path: '/login' }
  

];

const Header = () => {
  const router =useRouter()
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (path: string, event: any) => {
    event.preventDefault();

    if (path.startsWith("#")) {
      // Scroll to section if it's an anchor link
      document.querySelector(path)?.scrollIntoView({ behavior: "smooth" });
    } else {
      // Navigate to new page
      router.push(path);
    }
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          background: scrolled ? 'linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0))' : 'transparent',
          boxShadow: 'none',
          padding: '20px 0',
          color: 'white'
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ display: 'flex', justifyContent: {xs:"center", md:'space-between'}, alignItems: 'center' }}>
            <Link href="/" style={{ textDecoration: 'none', display:"flex", justifyContent:"center" }}>
              <Image src="/logo1.png" alt="Logo" width={200} height={100} priority style={{ height: 'auto' }} />
            </Link>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: '30px', alignItems: 'center' }}>
              {navLinks.map((item, index) => (
                <Link
                key={index}
                href={item.path}
                onClick={(e) => handleNavigation(item.path, e)}
                style={{ textDecoration: "none", color: "#fff", cursor: "pointer" }}
              >   <motion.div whileHover={{ scale: 1.1 }}>
                    <ListItemText
                      primary={item.title}
                      sx={{
                        fontSize:"1.5rem",
                        color: scrolled ? 'white' : 'black',
                        fontWeight: '800',
                       textTransform: 'uppercase',
                        '&:hover': { color: 'blue', transition: '0.3s' },
                        
                      }}
                      style={{fontSize:"30px"}}
                    />
                  </motion.div>
                </Link>
              ))}
            </Box>
            <IconButton color="inherit" edge="end" onClick={handleDrawerToggle} sx={{ display: { xs: 'block', md: 'none' }, color: '#000' }}>
              <MenuIcon sx={{ fontSize: '30px' }} />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>
              {/* Mobile Drawer */}
              <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle}>
          <List>
            {navLinks.map((item, index) => (
              <ListItem button key={index} component={Link} href={item.path} onClick={handleDrawerToggle}>
                <ListItemText
                  primary={item.title}
                  sx={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}
                  
              />
              </ListItem>
            ))}
          </List>
        </Drawer>
      <Box id='home' sx={{
          backgroundImage: "url('/header-background.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          width: '100%',
          minHeight: '500px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'end',
          textAlign: 'center',
          padding: '50px 20px',
          height: '100vh'
        }}
      >
         <Typography variant="h3" sx={{ fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' } }} fontWeight="bold" color="white" mb={4} sx={{ textShadow: '2px 2px 6px rgba(0,0,0,0.3)' }}>
      Our Chief Boarding Officer Welcomes You
        </Typography>
      </Box>
      <Box id='services'><Services /></Box>
     
      <Box id='contact'><ContactUs /></Box>

      {/* Footer Section */}
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
            © {new Date().getFullYear()} Canaan Pet Resort. All Rights Reserved.
          </Typography>
        </Container>
      </Box>
    </>
  );
};

export default Header;
