import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

// Public pages - loaded immediately
import Home from "./pages/Home/Home";
import Courses from "./pages/Courses/Courses";
import CourseDetails from "../src/pages/CousrseDetails/CourseDetails";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import NotFound from "./pages/NotFound/NotFound";

// Lazy load heavy components for code splitting
const CoursePlayer = lazy(() => import("./pages/CoursePlayer/CoursePlayer"));
const StudentDashboard = lazy(() => import("./pages/student/StudentDashboard"));
const AdminDashboard = lazy(() => import("./pages/admin/components/AdminDashboard"));
const AdminOverview = lazy(() => import("./pages/admin/pages/AdminOverview"));
const ManageCourses = lazy(() => import("./pages/admin/pages/ManageCourses"));
const Enrollments = lazy(() => import("./pages/admin/pages/Enrollments"));
const Assignments = lazy(() => import("./pages/admin/pages/Assignments"));
const Analytics = lazy(() => import("./pages/admin/pages/Analytics"));
const CreateCourse = lazy(() => import("./pages/admin/pages/CreateCourse"));
const EditCourse = lazy(() => import("./pages/admin/pages/EditCourse"));
const ManageUsers = lazy(() => import("./pages/admin/pages/ManageUsers"));
const VideoClasses = lazy(() => import("./pages/admin/pages/VideoClasses"));

// Global fallback loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <span className="loading loading-spinner loading-lg text-primary"></span>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Main public layout */}
          <Route element={<MainLayout />}>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Student Dashboard (Protected for Students) */}
            <Route
              path="/student"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

            {/* Course Player (Protected) */}
            <Route
              path="/courses/:id/player"
              element={
                <ProtectedRoute allowedRoles={["student", "admin"]}>
                  <CoursePlayer />
                </ProtectedRoute>
              }
            />

            {/* Admin Dashboard with Nested Routes (Protected for Admins - Fixed Bug-028) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            >
              {/* Nested Admin Pages (Cleaned up redundant inner Suspense wrappers - Fixed Bug-029) */}
              <Route index element={<AdminOverview />} />
              <Route path="courses" element={<ManageCourses />} />
              <Route path="courses/edit/:id" element={<EditCourse />} />
              <Route path="courses/create" element={<CreateCourse />} />
              <Route path="video-classes" element={<VideoClasses />} />
              <Route path="enrollments" element={<Enrollments />} />
              <Route path="assignments" element={<Assignments />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="users" element={<ManageUsers />} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}