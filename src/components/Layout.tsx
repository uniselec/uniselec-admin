import { AppBar, Box, Button, CssBaseline, ThemeProvider } from "@mui/material";
import { Container } from "@mui/system";
import { SnackbarProvider } from "notistack";
import React, { useState } from "react";
import { useAppTheme } from "../hooks/useAppTheme";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useSelector } from "react-redux";
import Paper from '@mui/material/Paper';
import { selectIsAuthenticated } from "../features/auth/authSlice";
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Link } from "react-router-dom";

const drawerWidth = 240;

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


export function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentTheme, toggleCurrentTheme] = useAppTheme();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <AppBar
          position="fixed"
        >
          <Header
            handleDrawerToggle={handleDrawerToggle}
            toggle={toggleCurrentTheme}
            isDark={currentTheme.palette.mode === "dark"}
            isAuth={isAuthenticated}
          />
        </AppBar>
        <SnackbarProvider
          autoHideDuration={2000}
          maxSnack={3}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
                <Container sx={{ color: "white", mt: 25, mb: 5, flexGrow: 1 }}>
                  {children}
                </Container>
        </SnackbarProvider>

      </Box>
      <Footer />
    </ThemeProvider>
  );
}