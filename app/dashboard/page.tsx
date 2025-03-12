"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { 
  Box, Typography, Card, CardContent, Avatar, Grid, Button, Divider, Container, IconButton
} from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import AddIcon from "@mui/icons-material/Add";

export default function Dashboard() {
  const router = useRouter();
  
  // Get owner details from Redux
  const owner = useSelector((state: RootState) => state.owner.owner);
  const allDogs = useSelector((state: RootState) => state.dog.dogs);

  return (
    <Container maxWidth="lg">
      
      {/* Dashboard Header */}
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
              <Grid item key={dog._id} xs={12} sm={6} md={4}>
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
                      variant="contained" color="primary" fullWidth sx={{ mt: 2 }}
                      onClick={() => router.push(`/bookings?dogId=${dog._id}`)}
                    >
                      📅 Book Now
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
