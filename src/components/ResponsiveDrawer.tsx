import {
  Divider,
  List,
  ListItem,
  Toolbar,
  Typography,
  Box,
  Drawer,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { selectAuthUser } from "../features/auth/authSlice";

// import styled from "styled-components";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";



const drawerWidth = 300;

type Props = {
  open: boolean;
  onClose: () => void;
  isDark: boolean;
};

export default function ResponsiveDrawer({ open, onClose, isDark }: Props) {
  const userAuth = useAppSelector(selectAuthUser);
  const routes = [
    { path: "/", name: "Início", roles: ["super_user", "promoter"]  },
    { path: "/academic-units", name: "Unidades Academicas", roles: ["super_user", "promoter"]  },
    { path: "/admission-categories", name: "Modalidades", roles: ["super_user", "promoter"]  },
    { path: "/bonus-options", name: "Bonificação", roles: ["super_user", "promoter"]  },
    { path: "/courses", name: "Cursos", roles: ["super_user", "promoter"]  },
    { path: "/process-selections", name: "Seleções", roles: ["super_user", "promoter"]  },
    { path: "/admins", name: "Admins", roles: ["super_user"] },
    { path: "/users", name: "Candidatos", roles: ["super_user"]},
    { path: "/applications", name: "Inscrições", roles: ["super_user"]},
    { path: "/csv-export", name: "CSV Export", roles: ["super_user"]},
    { path: "/enem-scores", name: "Notas do Enem", roles: ["super_user"]},
    { path: "/enem-scores-import", name: "Importar Notas", roles: ["super_user"]},
    { path: "/profile", name: "Perfil", roles: ["super_user"] },
  ];

  const drawer = (
    <div>
      <Toolbar sx={{ mt: 5 }}>
        UniSelec - Admin
      </Toolbar>
      <Divider />
      <List>
        {routes
          .filter((route) => route.roles.includes(userAuth.role))
          .map((route) => (
            <Link
              key={route.path}
              to={route.path}
              onClick={onClose}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemText>{route.name}</ListItemText>
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 }, zIndex: 2 }}
    >
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>

      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            backgroundColor: "background.default",
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
