import { Box } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Login } from "./features/auth/Login";
import { AuthProfile } from "./features/auth/AuthProfile";
import { NotFoundCard } from "./components/NotFoundCard";
import { ApplicationList } from "./features/applications/ApplicationList";
import { UserList } from "./features/users/UserList";
import { DashboardApplications } from "./features/applications/DashboardApplications";
import { ApplicationSelected } from "./features/applications/ApplicationSelected";
import { ApplicationCSVDownload } from "./features/applications/ApplicationCSVDownload";
import { EnemScoreList } from "./features/enemScores/EnemScoreList";
import { ApplicationOutcomeList } from "./features/applicationOutcomes/ApplicationOutcomeList";
import { ApplicationOutcomeEdit } from "./features/applicationOutcomes/ApplicationOutcomeEdit";
import { EnemScoreImport } from "./features/enemScores/EnemScoreImport";
import { EnemScoreSelected } from "./features/enemScores/EnemScoreSelected";
import { GenerateApplicationOutcomes } from "./features/applicationOutcomes/GenerateApplicationOutcomes";
import { ApplicationOutcomeGenerateDocuments } from "./features/applicationOutcomes/ApplicationOutcomeGenerateDocuments";
import { DeferidosIndeferidosList } from "./features/applicationOutcomes/DeferidosIndeferidosList";




function App() {
  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Layout>
        <Routes>
          <Route path="/" element={<ProtectedRoute><DeferidosIndeferidosList /></ProtectedRoute>} />
          <Route path="/deferidos-indeferidos" element={<ProtectedRoute><DeferidosIndeferidosList /></ProtectedRoute>} />
          <Route path="/listas-resultado" element={<ProtectedRoute><ApplicationOutcomeGenerateDocuments /></ProtectedRoute>} />
          <Route path="/import-enem-score" element={<ProtectedRoute><EnemScoreImport /></ProtectedRoute>} />
          <Route path="/export-csv" element={<ProtectedRoute><ApplicationCSVDownload /></ProtectedRoute>} />
          <Route path="/generate-results" element={<ProtectedRoute><GenerateApplicationOutcomes /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
          <Route path="/applications" element={<ProtectedRoute><ApplicationList /></ProtectedRoute>} />
          <Route path="/applications/:id" element={<ProtectedRoute><ApplicationSelected /></ProtectedRoute>} />

          <Route path="/charts" element={<ProtectedRoute><ApplicationList /></ProtectedRoute>} />


          <Route path="/dashboard" element={<ProtectedRoute><DashboardApplications /></ProtectedRoute>} />


          <Route path="/profile" element={<ProtectedRoute><AuthProfile /></ProtectedRoute>} />

          <Route path="/enem-scores" element={<ProtectedRoute><EnemScoreList /></ProtectedRoute>} />
          <Route path="/enem-scores/edit/:id" element={<ProtectedRoute><EnemScoreSelected /></ProtectedRoute>} />

          <Route path="/application-outcomes" element={<ProtectedRoute><ApplicationOutcomeList /></ProtectedRoute>} />
          <Route path="/application-outcomes/edit/:id" element={<ProtectedRoute><ApplicationOutcomeEdit /></ProtectedRoute>} />


          <Route path="/login" element={<Login />} />

          <Route path="*" element={<NotFoundCard />} />
        </Routes>
      </Layout>

    </Box>

  )
}

export default App;
