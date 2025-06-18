// theme.ts
import { createTheme } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import { ptBR } from "@mui/material/locale";

/* Paleta institucional (cores que você passou) */
const brand = {
  yellow:  "#FFC82B", // Pantone 1225UP
  orange:  "#F62231", // Pantone 1655UP
  red:     "#EE3235", // Pantone 199UP
  burgundy:"#851A22", // Pantone 181EC
  lime:    "#A8D04F", // Pantone 375EC
  green:   "#15924F", // Pantone 304EC
  blue:    "#377BBF", // Pantone 3005EC
  navy:    "#123C64", // Pantone 2955EC
  black:   "#000000",
  white:   "#FFFFFF",
};

/* Escala cinza adaptada para o modo escuro – evita texto branco sobre fundo claro */
const darkGreyScale = {
  50:  "#2C2C2C",
  100: "#333333",
  200: "#3D3D3D",
  300: "#474747",
  400: "#5C5C5C",
  500: "#707070",
  600: "#8B8B8B",
  700: "#A2A2A2",
  800: "#B8B8B8",
  900: "#D0D0D0",
};

declare module "@mui/material/styles" {
  /* permite acessar theme.palette.brand.xxx */
  interface Palette {
    brand: typeof brand;
  }
  interface PaletteOptions {
    brand?: typeof brand;
  }
}

/* ---------- MODO CLARO ---------- */
export const lightTheme = createTheme(
  {
    palette: {
      mode: "light",
      primary: { main: "#3b0304" },   // mantém sua cor principal
      secondary: { main: brand.red }, // segue institucional
      background: {
        default: "#FFFFFF",
        paper:   "#F5F6F9",
      },
      text: {
        primary: "#000000",
        secondary: grey[700],
      },
      brand, // acesso via theme.palette.brand
    },
  },
  ptBR
);

/* ---------- MODO ESCURO ---------- */
export const darkTheme = createTheme(
  {
    palette: {
      mode: "dark",
      primary: { main: brand.yellow }, // contraste bom em dark; ajuste se preferir
      secondary: { main: brand.red },
      background: {
        default: "#222222",
        paper:   "#1B1B1B",
      },
      text: {
        primary: "#F5F5F1",
        secondary: grey[400],
      },
      grey: { ...grey, ...darkGreyScale }, // ⚠️ sobrescreve cinzas claros
      brand,
    },
    components: {
      /* garante que todo Paper use background.paper (evita tom claro acidental) */
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backgroundColor: "#1B1B1B",
          },
        },
      },
    },
  },
  ptBR
);
