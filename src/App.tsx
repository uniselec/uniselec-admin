import { Box } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Login } from "./features/auth/Login";
import { OrganizationCreate } from "./features/organizations/OrganizationCreate";
import { OrganizationEdit } from "./features/organizations/OrganizationEdit";
import { OrganizationList } from "./features/organizations/OrganizationList";
import { AuthProfile } from "./features/auth/AuthProfile";
import { NotFoundCard } from "./components/NotFoundCard";
import { ApplicationList } from "./features/applications/ApplicationList";
import { UserList } from "./features/users/UserList";
import ApplicationsChart from "./features/applications/ApplicationChart";




function App() {
  return (
    <Box
      component="main"
      sx={{
        height: "100vh"
      }}
    >
      <Layout>
        <Routes>
          <Route path="/" element={<ProtectedRoute><UserList /></ProtectedRoute>} />

          <Route path="/charts" element={<ProtectedRoute><ApplicationList /></ProtectedRoute>} />
          <Route path="/organizations" element={<ProtectedRoute><OrganizationList /></ProtectedRoute>} />
          <Route path="/organizations/edit/:id" element={<ProtectedRoute><OrganizationEdit /></ProtectedRoute>} />
          <Route path="/organizations/create" element={<ProtectedRoute><OrganizationCreate /></ProtectedRoute>} />

          <Route path="/applications" element={<ProtectedRoute><ApplicationList /></ProtectedRoute>} />


          <Route path="/profile" element={<ProtectedRoute><AuthProfile /></ProtectedRoute>} />




          <Route path="/login" element={<Login />} />

          <Route path="*" element={<NotFoundCard/>} />
        </Routes>
      </Layout>

    </Box>

  )
}

export default App;
