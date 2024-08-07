import { createTheme } from "@mui/material";
import { ptBR } from '@mui/material/locale';




export const darkTheme = createTheme({
  palette: {
    background: { default: "#222222" },
    mode: "dark",
    primary: { main: "#f5f5f1" },
    secondary: { main: "#E50914" },
    text: { primary: "#f5f5f1" },
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
}, ptBR);