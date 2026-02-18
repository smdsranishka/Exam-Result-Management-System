import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

// Pages
import Login from "./pages/Login";
import SetPassword from "./pages/SetPassword";
import SupervisorDashboard from "./pages/SupervisorDashboard";
import AdminVerifyKey from "./pages/AdminVerifyKey";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminSubjects from "./pages/admin/AdminSubjects";
import AdminResults from "./pages/admin/AdminResults";
import StudentProfile from "./pages/student/StudentProfile";
import StudentResults from "./pages/student/StudentResults";

const AppContent = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/set-password" element={<SetPassword />} />
      <Route
        path="/unauthorized"
        element={
          <div className="p-10 text-center text-red-500 font-bold">
            403 - UNAUTHORIZED ACCESS
          </div>
        }
      />

      {/* Supervisor Routes */}
      <Route element={<ProtectedRoute allowedRoles={["SUPERVISOR"]} />}>
        <Route
          path="/supervisor"
          element={
            <Layout>
              <SupervisorDashboard />
            </Layout>
          }
        />
        <Route
          path="/supervisor/admins"
          element={
            <Layout>
              <SupervisorDashboard />
            </Layout>
          }
        />
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route path="/admin/verify-key" element={<AdminVerifyKey />} />
        <Route
          path="/admin"
          element={
            <Layout>
              <AdminDashboard />
            </Layout>
          }
        />{" "}
        {/* Redirect to students as home */}
        <Route
          path="/admin/students"
          element={
            <Layout>
              <AdminStudents />
            </Layout>
          }
        />
        <Route
          path="/admin/subjects"
          element={
            <Layout>
              <AdminSubjects />
            </Layout>
          }
        />
        <Route
          path="/admin/results"
          element={
            <Layout>
              <AdminResults />
            </Layout>
          }
        />
      </Route>

      {/* Student Routes */}
      <Route element={<ProtectedRoute allowedRoles={["STUDENT"]} />}>
        <Route
          path="/student"
          element={
            <Layout>
              <StudentProfile />
            </Layout>
          }
        />
        <Route
          path="/student/results/:level"
          element={
            <Layout>
              <StudentResults />
            </Layout>
          }
        />
      </Route>

      {/* Default Redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
