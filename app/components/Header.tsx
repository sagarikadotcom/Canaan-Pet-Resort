import { AppBar, Box, Container, IconButton, ListItemText, Toolbar } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion';

const navLinks = [
  { title: 'Home', path: '#home' },
  { title: 'Services', path: '#services' },
  { title: 'Get in Touch', path: '#contact' }
];

const Header=()=>{
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

    return(
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
              <Image src="/logo.png" alt="Logo" width={200} height={100} priority style={{ height: 'auto' }} />
            </Link>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: '30px', alignItems: 'center' }}>
              {navLinks.map((item, index) => (
                <Link key={index} href={item.path} onClick={(e) => { e.preventDefault(); document.querySelector(item.path)?.scrollIntoView({ behavior: 'smooth' }); }} style={{ textDecoration: 'none', color: '#000' }}>
                  <motion.div whileHover={{ scale: 1.1 }}>
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
        </>
    )
}

export default Header