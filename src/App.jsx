import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Public Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentProfile from "./pages/student/StudentProfile";
import JobDrives from "./pages/student/JobDrives";
import CodingCompetition from "./pages/student/CodingCompetition";
import QuizModule from "./pages/student/QuizModule";
import PerformanceTracking from "./pages/student/PerformanceTracking";

// Officer Pages
import OfficerDashboard from "./pages/officer/OfficerDashboard";
import CreateJobDrive from "./pages/officer/CreateJobDrive";
import ApplicationsManagement from "./pages/officer/ApplicationsManagement";
import StudentManagement from "./pages/officer/StudentManagement";
import ReportsAnalytics from "./pages/officer/ReportsAnalytics";

function App() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/students")
      .then((res) => res.json())
      .then((data) => {
        console.log("Students Data:", data);
        setStudents(data);
      })
      .catch((err) => {
        console.error("Error fetching students:", err);
      });
  }, []);

  return (
    <Router>
      <div>

        {/* Routes */}
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Student Routes */}
          <Route
            path="/student/dashboard"
            element={<StudentDashboard />}
          />
          <Route
            path="/student/profile"
            element={<StudentProfile />}
          />
          <Route
            path="/student/drives"
            element={<JobDrives />}
          />
          <Route
            path="/student/coding"
            element={<CodingCompetition />}
          />
          <Route
            path="/student/quiz"
            element={<QuizModule />}
          />
          <Route
            path="/student/performance"
            element={<PerformanceTracking />}
          />

          {/* Officer Routes */}
          <Route
            path="/officer/dashboard"
            element={<OfficerDashboard />}
          />
          <Route
            path="/officer/create-drive"
            element={<CreateJobDrive />}
          />
          <Route
            path="/officer/applications"
            element={<ApplicationsManagement />}
          />
          <Route
            path="/officer/students"
            element={<StudentManagement />}
          />
          <Route
            path="/officer/reports"
            element={<ReportsAnalytics />}
          />

          {/* Invalid Route Redirect */}
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>

        {/* Students API Test Section */}
        <div style={{ padding: "20px" }}>
          <h2>Students List</h2>

          {students.length === 0 ? (
            <p>No students found</p>
          ) : (
            students.map((student) => (
              <div
                key={student.student_id}
                style={{
                  border: "1px solid gray",
                  marginBottom: "10px",
                  padding: "10px",
                }}
              >
                <p>
                  <strong>Name:</strong> {student.name}
                </p>

                <p>
                  <strong>CGPA:</strong> {student.cgpa}
                </p>
              </div>
            ))
          )}
        </div>

      </div>
    </Router>
  );
}

export default App;