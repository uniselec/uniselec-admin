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
import { DeferidosIndeferidosList } from "./features/applicationOutcomes/DeferidosIndeferidosList";
import { ApplicationResults } from "./features/applicationOutcomes/ApplicationResults";
import { ApplicationResultsNo20 } from "./features/applicationOutcomes/ApplicationResultsNo20";
import { ProcessSelectionList } from "./features/processSelections/ProcessSelectionList";
import { ProcessSelectionEdit } from "./features/processSelections/ProcessSelectionEdit";
import { ProcessSelectionCreate } from "./features/processSelections/ProcessSelectionCreate";
import { CourseList } from "./features/courses/CourseList";
import { CourseEdit } from "./features/courses/CourseEdit";
import { CourseCreate } from "./features/courses/CourseCreate";
import { ProcessSelectionDetails } from "./features/processSelections/ProcessSelectionDetails";
import { ProcessSelectionResume } from "./features/processSelections/ProcessSelectionResume";
import { ProcessSelectionDetailStepper } from "./features/processSelections/ProcessSelectionDetailStepper";
import { AcademicUnitList } from "./features/academicUnits/AcademicUnitList";
import { AcademicUnitEdit } from "./features/academicUnits/AcademicUnitEdit";
import { AcademicUnitCreate } from "./features/academicUnits/AcademicUnitCreate";
import { AdmissionCategoryList } from "./features/admissionCategories/AdmissionCategoryList";
import { AdmissionCategoryEdit } from "./features/admissionCategories/AdmissionCategoryEdit";
import { AdmissionCategoryCreate } from "./features/admissionCategories/AdmissionCategoryCreate";
import { BonusOptionList } from "./features/bonusOptions/BonusOptionList";
import { BonusOptionEdit } from "./features/bonusOptions/BonusOptionEdit";
import { BonusOptionCreate } from "./features/bonusOptions/BonusOptionCreate";





function App() {
  return (
    <Box
      component="main"
      sx={{
        height: "100vh",
        overflow: "auto"
      }}
    >
      <Layout>
        <Routes>
          <Route path="/" element={<ProtectedRoute><ProcessSelectionResume /></ProtectedRoute>} />


          <Route path="/process-selections" element={<ProtectedRoute><ProcessSelectionList /></ProtectedRoute>} />
          <Route path="/process-selections/edit/:id" element={<ProtectedRoute><ProcessSelectionEdit /></ProtectedRoute>} />
          <Route path="/process-selections/details/:id" element={<ProtectedRoute><ProcessSelectionDetailStepper /></ProtectedRoute>} />
          <Route path="/process-selections/create" element={<ProtectedRoute><ProcessSelectionCreate /></ProtectedRoute>} />




          <Route path="/admission-categories" element={<ProtectedRoute><AdmissionCategoryList /></ProtectedRoute>} />
          <Route path="/admission-categories/edit/:id" element={<ProtectedRoute><AdmissionCategoryEdit /></ProtectedRoute>} />
          <Route path="/admission-categories/create" element={<ProtectedRoute><AdmissionCategoryCreate /></ProtectedRoute>} />


          <Route path="/bonus-options" element={<ProtectedRoute><BonusOptionList /></ProtectedRoute>} />
          <Route path="/bonus-options/edit/:id" element={<ProtectedRoute><BonusOptionEdit /></ProtectedRoute>} />
          <Route path="/bonus-options/create" element={<ProtectedRoute><BonusOptionCreate /></ProtectedRoute>} />


          <Route path="/academic-units" element={<ProtectedRoute><AcademicUnitList /></ProtectedRoute>} />
          <Route path="/academic-units/edit/:id" element={<ProtectedRoute><AcademicUnitEdit /></ProtectedRoute>} />
          <Route path="/academic-units/create" element={<ProtectedRoute><AcademicUnitCreate /></ProtectedRoute>} />




          <Route path="/courses" element={<ProtectedRoute><CourseList /></ProtectedRoute>} />
          <Route path="/courses/edit/:id" element={<ProtectedRoute><CourseEdit /></ProtectedRoute>} />
          <Route path="/courses/create" element={<ProtectedRoute><CourseCreate /></ProtectedRoute>} />




          <Route path="/deferidos-indeferidos" element={<ProtectedRoute><DeferidosIndeferidosList /></ProtectedRoute>} />
          <Route path="/:processSelectionId/import-enem-score/" element={<ProtectedRoute><EnemScoreImport /><EnemScoreList /></ProtectedRoute>} />
          <Route path="/:processSelectionId/export-csv" element={<ProtectedRoute><ApplicationCSVDownload /></ProtectedRoute>} />
          <Route path="/:processSelectionId/generate-results" element={<ProtectedRoute><GenerateApplicationOutcomes /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
          <Route path="/:processSelectionId/applications" element={<ProtectedRoute><ApplicationList /></ProtectedRoute>} />
          <Route path="/:processSelectionId/applications/:id" element={<ProtectedRoute><ApplicationSelected /></ProtectedRoute>} />
          <Route path="/applications-results/:categoryId" element={<ProtectedRoute><ApplicationResults /></ProtectedRoute>} />
          <Route path="/applications-results/no20/:categoryId" element={<ProtectedRoute><ApplicationResultsNo20 /></ProtectedRoute>} />
          <Route path="/charts" element={<ProtectedRoute><ApplicationList /></ProtectedRoute>} />


          <Route path="/dashboard" element={<ProtectedRoute><DashboardApplications /></ProtectedRoute>} />


          <Route path="/profile" element={<ProtectedRoute><AuthProfile /></ProtectedRoute>} />
          <Route path="/:processSelectionId/enem-scores" element={<ProtectedRoute><EnemScoreList /></ProtectedRoute>} />

          <Route path="/:processSelectionId/enem-scores/edit/:id" element={<ProtectedRoute><EnemScoreSelected /></ProtectedRoute>} />

          <Route path="/application-outcomes/:processSelectionId" element={<ProtectedRoute><ApplicationOutcomeList /></ProtectedRoute>} />
          <Route path="/application-outcomes/edit/:id" element={<ProtectedRoute><ApplicationOutcomeEdit /></ProtectedRoute>} />


          <Route path="/login" element={<Login />} />

          <Route path="*" element={<NotFoundCard />} />
        </Routes>
      </Layout>

    </Box>

  )
}

export default App;
