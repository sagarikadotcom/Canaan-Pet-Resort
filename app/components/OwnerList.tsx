import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Card, CardContent, Typography, Box, Grid, Avatar } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useEffect, useCallback } from "react";
import axios from "axios";
import { setOwners } from "@/redux/slices/ownerSlice";

export default function OwnerList() {
  const dispatch = useDispatch();
  const owners = useSelector((state: RootState) => state.owner.owners) || [];

  // ✅ Fix: Wrap `getOwners` inside `useCallback` to avoid re-creation on every render
  const getOwners = useCallback(async () => {
    try {
      const response = await axios.get(`/api/get-owners`);
      dispatch(setOwners(response.data));
    } catch (err) {
      console.log(err);
    }
  }, [dispatch]); // ✅ Added `dispatch` as a dependency

  // ✅ Now we safely include `getOwners` in the dependency array
  useEffect(() => {
    getOwners();
  }, [getOwners]);

  return (
    <Box sx={{ p: 4, background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "bold", mb: 3, color: "#333" }}>
       {`🏡 Owners List (${owners.length})`}
      </Typography>

      {owners?.length > 0 ? (
        <Grid container spacing={3} justifyContent="center">
          {owners.map((owner, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
              <Card sx={{ 
                borderRadius: 3, 
                boxShadow: "0px 4px 10px rgba(0,0,0,0.2)", 
                transition: "0.3s", 
                "&:hover": { transform: "scale(1.05)", boxShadow: "0px 6px 15px rgba(0,0,0,0.3)" },
                background: "white"
              }}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Avatar sx={{ bgcolor: "#1976d2", width: 56, height: 56, margin: "auto", mb: 2 }}>
                    <AccountCircleIcon fontSize="large" />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1976d2" }}>
                    {owner.firstName} {owner.lastName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666" }}>📞 {owner.phoneNumber}</Typography>
                  <Typography variant="body2" sx={{ color: "#666" }}>📍 {owner.address}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="h6" sx={{ textAlign: "center", color: "#555", mt: 4 }}>
          🚨 No owners available.
        </Typography>
      )}
    </Box>
  );
}
