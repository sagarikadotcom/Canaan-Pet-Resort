"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { setBookings } from "@/redux/slices/bookingSlice";
import { setOwners } from "@/redux/slices/ownerSlice";
import { setDogs } from "@/redux/slices/dogSlice";

import {
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  CircularProgress,
  AppBar,
  IconButton,
  Tabs,
  Tab,
  Select,
  MenuItem,
  useMediaQuery,
} from "@mui/material";

import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import PetsIcon from "@mui/icons-material/Pets";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MenuIcon from "@mui/icons-material/Menu";

import BookingList from "../components/BookingList";
import OwnerList from "../components/OwnerList";
import DogList from "../components/DogList";
import BoardingUpdates from "../components/BoardingUpdates";
import Enquiry from "../components/EnquiryList ";

import dayjs from "dayjs";
import Kennels from "../components/Kennels";

const drawerWidth = 240;

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState("Bookings");
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month());

  const isMobile = useMediaQuery("(max-width:600px)");

  const fetchData = async (tab: string) => {
    setSelectedTab(tab);
    setLoading(true);
    let apiUrl = "";

    switch (tab) {
      case "Bookings":
        apiUrl = "/api/get-bookings";
        break;
      case "Owners":
        apiUrl = "/api/get-owners";
        break;
      case "Dogs":
        apiUrl = "/api/get-dogs";
        break;
      case "Boarding Updates":
        apiUrl = "/api/get-bookings?status:Confirmed";
        break;
      case "Enquiries":
        apiUrl = "/api/get-enquiries";
        break;
      default:
        return;
    }

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`Failed to fetch ${tab.toLowerCase()}`);
      const data = await response.json();
      if (tab === "Bookings") dispatch(setBookings(data));
      if (tab === "Owners") dispatch(setOwners(data));
      if (tab === "Dogs") dispatch(setDogs(data));
      if (tab === "Boarding Updates") dispatch(setBookings(data));
    } catch (error) {
      console.error(`Error fetching ${tab.toLowerCase()}:`, error);
    } finally {
      setLoading(false);
      if (isMobile) setMobileOpen(false);
    }
  };

  useEffect(() => {
    fetchData("Bookings");
  }, []);

  const drawer = (
    <Box sx={{ width: drawerWidth }}>
      <Toolbar />
      <List>
        {[
          { text: "Bookings", icon: <EventIcon /> },
          { text: "Owners", icon: <PeopleIcon /> },
          { text: "Dogs", icon: <PetsIcon /> },
          { text: "Boarding Updates", icon: <CalendarMonthIcon /> },
          { text: "Enquiries", icon: <EventIcon /> },
        ].map(({ text, icon }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => fetchData(text)}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: 1201, bgcolor: "#1976d2" }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              sx={{ mr: 2 }}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap sx={{ fontWeight: "bold" }}>
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` }, // ADD THIS
        }}
      >
        <Toolbar />
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
          {selectedTab}
        </Typography>

        {selectedTab === "Boarding Updates" && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Typography variant="body1" sx={{ mr: 2, fontWeight: "bold" }}>
              Select Month:
            </Typography>
            <Select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              sx={{ minWidth: 120 }}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <MenuItem key={i} value={i}>
                  {dayjs().month(i).format("MMMM")}
                </MenuItem>
              ))}
            </Select>
          </Box>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {selectedTab === "Bookings" && <BookingList />}
            {selectedTab === "Owners" && <OwnerList />}
            {selectedTab === "Dogs" && <DogList />}
            {selectedTab === "Boarding Updates" && <BoardingUpdates selectedMonth={selectedMonth} />}
            {selectedTab === "Enquiries" && <Kennels />}
          </>
        )}
      </Box>
    </>
  );
}
