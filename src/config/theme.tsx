import { createTheme } from "@mui/material";
import { ptBR } from '@mui/material/locale';

export const darkTheme = createTheme({
  palette: {
    background: { default: "#222222" },
    mode: "dark",
    primary: { main: "#f5f5f1" },
    secondary: { main: "#E50914" },
    text: { primary: "#f5f5f1", secondary: "#E0E0E0" }, // ajustado para maior contraste
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          color: "#f5f5f1", // texto padrão nos cards e outros componentes
        },
      },
    },
  },
}, ptBR);

export const lightTheme = createTheme({
  palette: {
    background: {
      default: '#FFF',
      paper: '#F5F6F9',
    },
    primary: { main: "#3b0304" },
    secondary: { main: "#E50914" },
    text: { primary: "#000000", secondary: "#333333" }
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          color: "#000000", // texto padrão nos cards e outros componentes
        },
      },
    },
  },
}, ptBR);
