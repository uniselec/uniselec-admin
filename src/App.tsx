import { Box } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Login } from "./features/auth/Login";
import { AuthProfile } from "./features/auth/AuthProfile";
import { NotFoundCard } from "./components/NotFoundCard";
import { ApplicationList } from "./features/applications/ApplicationList";
import { UserList } from "./features/users/UserList";
import ApplicationsChart from "./features/applications/ApplicationChart";
import { DashboardApplications } from "./features/applications/DashboardApplications";
import { ApplicationSelected } from "./features/applications/ApplicationSelected";




function App() {
  return (
    <Box
      component="main"
      sx={{
        height: "90vh"
      }}
    >
      <Layout>
        <Routes>
          <Route path="/" element={<ProtectedRoute><DashboardApplications /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
          <Route path="/applications" element={<ProtectedRoute><ApplicationList  /></ProtectedRoute>} />
          <Route path="/applications/:id" element={<ProtectedRoute><ApplicationSelected /></ProtectedRoute>} />

          <Route path="/charts" element={<ProtectedRoute><ApplicationList /></ProtectedRoute>} />


          <Route path="/dashboard" element={<ProtectedRoute><DashboardApplications /></ProtectedRoute>} />


          <Route path="/profile" element={<ProtectedRoute><AuthProfile /></ProtectedRoute>} />




          <Route path="/login" element={<Login />} />

          <Route path="*" element={<NotFoundCard/>} />
        </Routes>
      </Layout>

    </Box>

  )
}

export default App;
