/* import { AppBar, Box, Container, Divider, Drawer, IconButton, List, ListItem, ListItemText, Toolbar, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion';
import MenuIcon from '@mui/icons-material/Menu';

const navLinks = [
  { title: 'Home', path: '#home' },
  { title: 'Services', path: '#services' },
  { title: 'Get in Touch', path: '#contact' },
  { title: 'Login', path: '/login' },

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
       <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1976d2" }}>
          🏠 Dashboard
        </Typography>
        {owner && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
              Welcome, {owner.firstName} {owner.lastName}
            </Typography>
            <Typography variant="body2" sx={{ color: "#666" }}>
              📧 {owner.email} | 📞 {owner.phoneNumber}
            </Typography>
            <Typography variant="body2" sx={{ color: "#666" }}>
              🏠 {owner.address}
            </Typography>
          </Box>
        )}
      </Box>

      <Divider sx={{ mb: 3 }} />
        </>
    )
}

export default Header */