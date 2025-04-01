"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { 
  Box, Typography, Card, CardContent, Avatar, Grid, Button, Divider, Container, IconButton,
  Menu,
  MenuItem
} from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { clearOwner } from "@/redux/slices/ownerSlice";

export default function Dashboard() {
  const router = useRouter();
  const dispatch =useDispatch()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // Get owner details from Redux
  const owner = useSelector((state: RootState) => state.owner.owner);
  const allDogs = useSelector((state: RootState) => state.dog.dogs);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Logout Function
  const handleLogout = () => {
    dispatch(clearOwner()); // Clears Redux state
    router.push("/"); // Redirect to home
  };

  return (
    <Container maxWidth="lg">
      
      {/* Dashboard Header */}
   
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1976d2" }}>
        🏠 Dashboard
      </Typography>
      

      {/* Avatar with Clickable Menu */}
      <IconButton onClick={handleClick} sx={{ ml: 2 }}>
        <Avatar 
         // src={profilePicture} 
          sx={{ width: 48, height: 48, cursor: "pointer", border: "2px solid #1976d2" }}
        >
       {/* {firstName?.charAt(0) || "?"} */}
        </Avatar>
      </IconButton>

      {/* Logout Menu Positioned Below Avatar */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }} // Position Below Avatar
        transformOrigin={{ vertical: "top", horizontal: "right" }}  // Prevent Overlapping
        sx={{ mt: 1 }} // Adds spacing
      >
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
      
    </Box>
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
      <Divider sx={{ mb: 3 }} />

      {/* Dog List Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333" }}>
            🐾 Your Dogs
          </Typography>

          {/* Smaller Add Dog Button */}
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={() => router.push("/add-dog")}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              borderRadius: 2,
              px: 2,
              py: 1,
              boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
              "&:hover": { backgroundColor: "#1565C0" }
            }}
          >
            Add Dog
          </Button>
        </Box>

        <Grid container spacing={3} justifyContent="center">
          
          {/* List of Dog Cards */}
          {allDogs?.length > 0 ? (
            allDogs.map((dog) => (
              <Grid item key={dog._id} xs={12} sm={6} md={6}>
                <Card 
                  sx={{
                    borderRadius: 3, boxShadow: "0px 4px 8px rgba(0,0,0,0.1)", transition: "0.3s",
                    "&:hover": { transform: "scale(1.05)", boxShadow: "0px 6px 12px rgba(0,0,0,0.2)" },
                    background: "white"
                  }}
                >
                  <CardContent sx={{ textAlign: "center" }}>
                    
                    {/* Dog Avatar */}
                    <Avatar sx={{ bgcolor: "#ff9800", width: 64, height: 64, margin: "auto", mb: 1 }}>
                      <PetsIcon fontSize="large" />
                    </Avatar>

                    {/* Dog Details */}
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "#ff9800" }}>
                      {dog.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      🐶 Breed: {dog.breed}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      🎂 Age: {dog.age} years
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {dog.sex === "Male" ? "♂️ Male" : "♀️ Female"}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      🍖 Food: {dog.foodPreference}
                    </Typography>

                    {/* Book Now Button */}
                    <Button 
                      variant="contained" color="primary" 
                      onClick={() => router.push(`/bookings?dogId=${dog._id}`)}
                    >
                      📅 Book Boarding
                    </Button>
                  
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12} sx={{ textAlign: "center", mt: 3 }}>
              <Typography variant="h6" sx={{ color: "#555" }}>
                🚨 No dogs found. Add a dog to continue.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </Container>
  );
}
