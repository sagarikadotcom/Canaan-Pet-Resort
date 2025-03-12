"use client";

import { Box, Typography, Container } from "@mui/material";

export default function ContactPage() {
  return (
    <Container sx={{ py: 6, textAlign: "center" }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>📍 Contact Us</Typography>
      <Typography variant="body1">Happy Paws Boarding</Typography>
      <Typography variant="body2">📍 123 Dog Street, Pet Town, USA</Typography>
      <Typography variant="body2">📞 +1 234 567 890</Typography>
      <Typography variant="body2">📧 info@happypaws.com</Typography>
      
      {/* Google Maps Embed */}
      <Box sx={{ mt: 3 }}>
        <iframe
          title="Google Map"
          width="100%"
          height="400"
          style={{ border: 0 }}
          src="https://www.google.com/maps/embed/v1/place?q=123+Dog+Street,Pet+Town,USA&key=YOUR_GOOGLE_MAPS_API_KEY"
          allowFullScreen
        ></iframe>
      </Box>

      {/* Floating WhatsApp Button */}
      <Box sx={{ position: "fixed", bottom: 20, right: 20 }}>
        <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
          <img src="/images/whatsapp.png" alt="WhatsApp" width={60} />
        </a>
      </Box>
    </Container>
  );
}
