'use client';

import React from 'react';
import { Container, Typography, Grid, Box, IconButton, Link } from '@mui/material';
import { motion } from 'framer-motion';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Map from './Map'; // Import a custom Map component for Google Maps iframe

const ContactUs = () => {
  return (
    <Box sx={{
      py: 10,
      px: 4,
      background: 'linear-gradient(135deg, #f3f3f3, #ffffff)',
      borderRadius: '20px',
      boxShadow: 3,
    }}>
      <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
       
              <Typography variant="h3" fontWeight="bold" sx={{ color:"#318cb0" , mb: 4 }}>
            Get In Touch
          </Typography>
        </motion.div>
        <Grid container spacing={4} alignItems="center">
          {/* Left Section - Contact Details */}
          <Grid item xs={12} md={5}>
            <Box >
              <motion.div whileHover={{ scale: 1.05 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationOnIcon sx={{ mr: 1, color: '#ff6f61' }} />
                  Canaan pet resort and K9 Academy,   </Typography>
                  <Typography>1st Main road, Mitganahalli, Kadusonnapanahalli, Bengaluru, Karnataka 562149
                  </Typography>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EmailIcon sx={{ mr: 1, color: '#ff6f61' }} />
                  <Link href="mailto:contact@yourdomain.com" color="inherit" underline="none">
                    hello@canaanpetresort.com
                  </Link>
                </Typography>
              </motion.div>
              <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'center' }}>
                <motion.div whileHover={{ scale: 1.2 }}>
                  <IconButton href="https://www.facebook.com/petzservices" target="_blank" sx={{ background: '#1877F2', color: 'white' }}>
                    <FacebookIcon />
                  </IconButton>
                </motion.div>
                <motion.div whileHover={{ scale: 1.2 }}>
                  <IconButton href="https://www.instagram.com/canaanpetresort/?hl=en" target="_blank" sx={{ background: '#E4405F', color: 'white' }}>
                    <InstagramIcon />
                  </IconButton>
                </motion.div>
                <motion.div whileHover={{ scale: 1.2 }}>
                  <IconButton href="https://wa.me/+918951133804" target="_blank" sx={{ background: '#25D366', color: 'white' }}>
                    <WhatsAppIcon />
                  </IconButton>
                </motion.div>
              </Box>
            </Box>
          </Grid>
          
          {/* Right Section - Google Map */}
         {/*  <Grid item xs={12} md={7}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Box sx={{ borderRadius: '20px', overflow: 'hidden', boxShadow: 3 }}>
                <iframe
                  title="Google Maps"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345093747!2d144.95592631590457!3d-37.81720974202195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d5df1f623f7%3A0x5045675218ce6e0!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sin!4v1645568743242!5m2!1sen!2sin"
                  width="100%"
                  height="350"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </Box>
            </motion.div>
          </Grid> */}
        </Grid>
      </Container>
    </Box>
  );
};

export default ContactUs;
