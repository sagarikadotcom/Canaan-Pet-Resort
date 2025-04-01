"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

export default function EnquiryList() {
  const [enquiries, setEnquiries] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [remark, setRemark] = useState("");

  const fetchEnquiries = async () => {
    try {
      const res = await fetch("/api/enquiry");
      const data = await res.json();
      setEnquiries(data.enquiries || []);
    } catch (err) {
      console.error("Error fetching enquiries:", err);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleDoneClick = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setRemark(enquiry.remark || "");
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedEnquiry(null);
    setRemark("");
  };

  const submitRemark = async () => {
    try {
      const response = await fetch(`/api/enquiry/${selectedEnquiry._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ remark }),
      });

      if (!response.ok) {
        throw new Error("Failed to update remark");
      }

      alert("Remark updated successfully!");
      fetchEnquiries();
      handleClose();
    } catch (err) {
      console.error(err);
      alert("Error updating remark");
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={3}>
        Enquiry List
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Dog Name</TableCell>
              <TableCell>Remark</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {enquiries.map((enquiry) => (
              <TableRow key={enquiry._id}>
                <TableCell>
                  {enquiry.firstName} {enquiry.lastName}
                </TableCell>
                <TableCell>{enquiry.email}</TableCell>
                <TableCell>{enquiry.phone}</TableCell>
                <TableCell>{enquiry.dogName}</TableCell>
                <TableCell>{enquiry.remark || "-"}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleDoneClick(enquiry)}
                  >
                    Done
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Remark Dialog */}
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Add Remark</DialogTitle>
        <DialogContent>
          <TextField
            label="Remark"
            fullWidth
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={submitRemark}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
