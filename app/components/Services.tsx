'use client';

import React from 'react';
import { Container, Typography, Button, Grid, Card, CardContent, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const services = [
  {
    title: 'Boarding',
    description: 'Premium pet boarding facilities with top-notch care.',
    image: '/services/boarding.png',
    buttonLabel: 'Book Now',
  },
  {
    title: 'Board & Train',
    description: 'Comprehensive training while boarding for disciplined pets.',
    image: '/services/training.png',
    buttonLabel: 'Consult Now',
  },
  {
    title: 'Grooming',
    description: 'Professional grooming services to keep your pet looking great.',
    image: '/services/grooming1.png',
    buttonLabel: 'Book Now',
  },
  {
    title: 'Swimming',
    description: 'Safe and fun swimming sessions for your pet’s health.',
    image: '/services/swimming.png',
    buttonLabel: 'Book Now',
  },
  {
    title: 'Train The Trainer',
    description: 'Specialized training programs for trainers.',
    image: '/services/ttt.png',
    buttonLabel: 'Enquire Now',
  }
];

const Services = () => {
  const router=useRouter()
const handleAction = (title: string) => {
  if (title === 'Swimming' || title === 'Boarding' ) {
    router.push("/login");
  } else if (title==="Train The Trainer"){
    router.push("/trainer/enquiry");

  }else {
    router.push("/enquiry");
  }
};
  return (
    <Box sx={{ position: 'relative', py: 12, px: 4 }}>
      <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
              fontWeight: 'bold',
              color: '#318cb0',
              textShadow: '2px 2px 6px rgba(0,0,0,0.3)',
              mb: 4,
            }}
          >
            Our Services
          </Typography>
        </motion.div>
        <Grid container spacing={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Card
                  sx={{
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: 10,
                    position: 'relative',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': { transform: 'translateY(-10px)', boxShadow: 16 },
                    height:"600px"
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundImage: `url(${service.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    //  filter: 'brightness(0.8)',
                      zIndex: 1,
                    }}
                  />
                  <CardContent sx={{
                    position: 'relative',
                    zIndex: 2,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
                    minHeight: '400px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    color: 'white',
                    textAlign: 'center',
                    p: 3,
                    height:"100%"
                  }}>
                    <Typography variant="h6" fontWeight="bold">
                      {service.title}
                    </Typography>
                    <Typography variant="body2" mb={3}>
                      {service.description}
                    </Typography>
                   {!(service.title==="Swimming" || service.title==="Grooming")&& <motion.div whileHover={{ scale: 1.1 }}>
                      <Button
                        variant="contained"
                        sx={{
                          background: 'rgba(255, 255, 255, 0.8)',
                          color: '#333',
                          borderRadius: '50px',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          py: 1,
                          transition: 'all 0.3s ease-in-out',
                          '&:hover': {
                            background: 'rgba(255, 255, 255, 1)',
                            transform: 'scale(1.05)',
                          },
                        }}
                        fullWidth
                        onClick={()=>handleAction(service.title)}
                      >
                        {service.buttonLabel}
                      </Button>
                      
                    </motion.div>}
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

export default Services;
