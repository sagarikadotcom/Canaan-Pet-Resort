"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Card, CardContent, Typography, Box } from "@mui/material";

export default function DogList() {
  const dogs = useSelector((state: RootState) => state.dog.dogs.dogs);

  return (
    <Box>
      <Typography> {`DOGS (${dogs.length})`}</Typography>
      {console.log("dogs",dogs)}
      {dogs.length > 0 ? (
        dogs.map((dog, index) => (
          <Card key={index} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">🐶 {dog.name}</Typography>
              <Typography variant="body2">Breed: {dog.breed}</Typography>
              <Typography variant="body2">Age: {dog.age} years</Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography>No dogs available.</Typography>
      )}
    </Box>
  );
}
