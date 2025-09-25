import { Box } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Login } from "./features/auth/Login";
import { AuthProfile } from "./features/auth/AuthProfile";
import { NotFoundCard } from "./components/NotFoundCard";
import { UserList } from "./features/users/UserList";
// import { EnemScoreList } from "./features/enemScores/EnemScoreList";

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
import { AdminList } from "./features/admins/AdminList";
import { AdminEdit } from "./features/admins/AdminEdit";
import { AdminCreate } from "./features/admins/AdminCreate";
import { UserDetails } from "./features/users/UserDetails";
import { PasswordReset } from "./features/auth/PasswordReset";
import { AuthProfileEdit } from "./features/auth/AuthProfileEdit";
import { ApplicationList } from "./features/applications/ApplicationList";
import { ApplicationDetail } from "./features/applications/ApplicationDetail";
import { EnemScoreList } from "./features/enemScores/EnemScoreList";
import { EnemScoreDetail } from "./features/enemScores/EnemScoreDetail";
import { ApplicationOutcomeList } from "./features/applicationOutcomes/ApplicationOutcomeList";
import { ApplicationOutcomeEdit } from "./features/applicationOutcomes/ApplicationOutcomeEdit";
import { DeferidosIndeferidosList } from "./features/processSelections/DeferidosIndeferidosList";
import { ApplicationResults } from "./features/processSelections/ApplicationResults";
import { ConvocationListApplicationList } from "./features/convocationListApplication/ConvocationListApplicationList";
import { ConvocationListApplicationEdit } from "./features/convocationListApplication/ConvocationListApplicationEdit";
import { ConvocationListApplicationCreate } from "./features/convocationListApplication/ConvocationListApplicationCreate";
import { ConvocationListList } from "./features/convocationLists/ConvocationListList";
import { ConvocationListCreate } from "./features/convocationLists/ConvocationListCreate";
import { ConvocationListSeatList } from "./features/convocationListSeats/ConvocationListSeatist";
import { ConvocationListSeatEdit } from "./features/convocationListSeats/ConvocationListSeatEdit";
import { ConvocationListSeatCreate } from "./features/convocationListSeats/ConvocationListSeatCreate";
import { ConvocationListDetail } from "./features/convocationLists/ConvocationListDetail";
import { ConvocationListEdit } from "./features/convocationLists/ConvocationListEdit";






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
          <Route path="/deferidos-indeferidos/:id" element={<ProtectedRoute><DeferidosIndeferidosList /></ProtectedRoute>} />
          <Route path="/applications-results" element={<ProtectedRoute><ApplicationResults /></ProtectedRoute>} />

          <Route path="/process-selections" element={<ProtectedRoute><ProcessSelectionList /></ProtectedRoute>} />
          <Route path="/process-selections/edit/:id" element={<ProtectedRoute><ProcessSelectionEdit /></ProtectedRoute>} />
          <Route path="/process-selections/details/:id" element={<ProtectedRoute><ProcessSelectionDetailStepper /></ProtectedRoute>} />
          <Route path="/process-selections/details2/:id" element={<ProtectedRoute><ProcessSelectionDetails /></ProtectedRoute>} />
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

          <Route path="/convocation-list-applications" element={<ProtectedRoute><ConvocationListApplicationList /></ProtectedRoute>} />
          <Route path="/convocation-list-applications/edit/:id" element={<ProtectedRoute><ConvocationListApplicationEdit /></ProtectedRoute>} />
          <Route path="/convocation-list-applications/create" element={<ProtectedRoute><ConvocationListApplicationCreate /></ProtectedRoute>} />

          <Route path="/process-selections/:id/convocation-lists" element={<ProtectedRoute><ConvocationListList /></ProtectedRoute>} />
          <Route path="/process-selections/:id/convocation-lists/detail/:convocationListId" element={<ProtectedRoute><ConvocationListDetail /></ProtectedRoute>} />
          <Route path="/process-selections/:id/convocation-lists/edit/:convocationListId" element={<ProtectedRoute><ConvocationListEdit /></ProtectedRoute>} />
          <Route path="/process-selections/:id/convocation-lists/create" element={<ProtectedRoute><ConvocationListCreate /></ProtectedRoute>} />


          <Route path="/convocation-list-seats" element={<ProtectedRoute><ConvocationListSeatList /></ProtectedRoute>} />
          <Route path="/convocation-list-seats/edit/:id" element={<ProtectedRoute><ConvocationListSeatEdit /></ProtectedRoute>} />
          <Route path="/convocation-list-seats/create" element={<ProtectedRoute><ConvocationListSeatCreate /></ProtectedRoute>} />


          <Route path="/applications" element={<ProtectedRoute><ApplicationList /></ProtectedRoute>} />
          <Route path="/applications/detail/:id" element={<ProtectedRoute><ApplicationDetail /></ProtectedRoute>} />


          <Route path="/enem-scores" element={<ProtectedRoute><EnemScoreList /></ProtectedRoute>} />
          <Route path="/enem-scores/detail/:id" element={<ProtectedRoute><EnemScoreDetail /></ProtectedRoute>} />

          <Route path="/users" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
          <Route path="/users/detail/:id" element={<ProtectedRoute><UserDetails /></ProtectedRoute>} />

          <Route path="/admins" element={<ProtectedRoute><AdminList /></ProtectedRoute>} />
          <Route path="/admins/edit/:id" element={<ProtectedRoute><AdminEdit /></ProtectedRoute>} />
          <Route path="/admins/create" element={<ProtectedRoute><AdminCreate /></ProtectedRoute>} />

          <Route path="/application-outcomes" element={<ProtectedRoute><ApplicationOutcomeList /></ProtectedRoute>} />
          <Route path="/application-outcomes/edit/:id" element={<ProtectedRoute><ApplicationOutcomeEdit /></ProtectedRoute>} />


          <Route path="/profile" element={<ProtectedRoute><AuthProfile /></ProtectedRoute>} />
          <Route path="/profile/edit" element={<ProtectedRoute><AuthProfileEdit /></ProtectedRoute>} />

          <Route path="/login" element={<Login />} />
          <Route path="/reset-password/:token/:email" element={<PasswordReset />} />

          <Route path="*" element={<NotFoundCard />} />


          {/* <Route path="/deferidos-indeferidos" element={<ProtectedRoute><DeferidosIndeferidosList /></ProtectedRoute>} /> */}
          {/* <Route path="/:processSelectionId/import-enem-score/" element={<ProtectedRoute><EnemScoreImport /><EnemScoreList /></ProtectedRoute>} /> */}
          {/* <Route path="/:processSelectionId/export-csv" element={<ProtectedRoute><ApplicationCSVDownload /></ProtectedRoute>} /> */}
          {/* <Route path="/:processSelectionId/generate-results" element={<ProtectedRoute><GenerateApplicationOutcomes /></ProtectedRoute>} /> */}


          {/* <Route path="/:processSelectionId/applications" element={<ProtectedRoute><ApplicationList /></ProtectedRoute>} /> */}

          {/*
          <Route path="/applications-results/no20/:categoryId" element={<ProtectedRoute><ApplicationResultsNo20 /></ProtectedRoute>} /> */}
          {/* <Route path="/charts" element={<ProtectedRoute><ApplicationList /></ProtectedRoute>} /> */}


          {/* <Route path="/dashboard" element={<ProtectedRoute><DashboardApplications /></ProtectedRoute>} /> */}



          {/* <Route path="/:processSelectionId/enem-scores/edit/:id" element={<ProtectedRoute><EnemScoreSelected /></ProtectedRoute>} /> */}

          {/* <Route path="/application-outcomes/:processSelectionId" element={<ProtectedRoute><ApplicationOutcomeList /></ProtectedRoute>} /> */}
          {/* <Route path="/application-outcomes/edit/:id" element={<ProtectedRoute><ApplicationOutcomeEdit /></ProtectedRoute>} /> */}



        </Routes>
      </Layout>

    </Box>

  )
}

export default App;
