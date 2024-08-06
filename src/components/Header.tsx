import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Button, IconButton, Toolbar } from "@mui/material";
import { AccountMenu } from "./AccountMenu";
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import LogoUNILAB from "../assets/img/logo-unilab.png";

const ImageLogo = styled('img')`
  width: 300px;
  padding: 30px;
`;

type HeaderProps = {
  toggle: () => void;
  isDark?: boolean;
  isAuth?: boolean;
  handleDrawerToggle?: () => void;
};

export function Header({ toggle, isAuth = false, isDark = false, handleDrawerToggle }: HeaderProps) {
  return (
    <Box>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/">
          <ImageLogo alt="Logo UNILAB" src={LogoUNILAB}/>
        </Link>
        <Box sx={{ flexGrow: 1 }} />
        {isAuth && (
          <AccountMenu isDark={isDark} toggleTheme={toggle} />
        )}
      </Toolbar>
    </Box>
  );
}
