import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/student/Login";
import Register from "./pages/student/Register";
import StudentDashboard from "./pages/student/StudentDashboard";
import SubmitComplaint from "./pages/student/SubmitComplaint";
import MyComplaints from "./pages/student/MyComplaints";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminComplaints from "./pages/admin/AdminComplaints";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import Welcome from "./pages/welcome";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= WELCOME ================= */}
        <Route path="/" element={<Welcome />} />

        {/* ================= STUDENT ================= */}

        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/register" element={<Register />} />

        <Route path="/login" element={<Login />} />

        {/* Student Dashboard */}

        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* Submit Complaint */}

        <Route
          path="/student/submit-complaint"
          element={
            <ProtectedRoute>
              <SubmitComplaint />
            </ProtectedRoute>
          }
        />

        {/* My Complaints */}

        <Route
          path="/student/my-complaints"
          element={
            <ProtectedRoute>
              <MyComplaints />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN ================= */}

        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Dashboard */}

        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />

        {/* Admin Complaints */}

        <Route
          path="/admin/complaints"
          element={
            <AdminProtectedRoute>
              <AdminComplaints />
            </AdminProtectedRoute>
          }
        />

        {/* ================= 404 ================= */}

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
