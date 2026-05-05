import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import JobDrives from './pages/student/JobDrives';
import CodingCompetition from './pages/student/CodingCompetition';
import QuizModule from './pages/student/QuizModule';
import PerformanceTracking from './pages/student/PerformanceTracking';
import OfficerDashboard from './pages/officer/OfficerDashboard';
import CreateJobDrive from './pages/officer/CreateJobDrive';
import ApplicationsManagement from './pages/officer/ApplicationsManagement';
import StudentManagement from './pages/officer/StudentManagement';
import ReportsAnalytics from './pages/officer/ReportsAnalytics';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Student */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/student/drives" element={<JobDrives />} />
        <Route path="/student/coding" element={<CodingCompetition />} />
        <Route path="/student/quiz" element={<QuizModule />} />
        <Route path="/student/performance" element={<PerformanceTracking />} />

        {/* Officer */}
        <Route path="/officer/dashboard" element={<OfficerDashboard />} />
        <Route path="/officer/create-drive" element={<CreateJobDrive />} />
        <Route path="/officer/applications" element={<ApplicationsManagement />} />
        <Route path="/officer/students" element={<StudentManagement />} />
        <Route path="/officer/reports" element={<ReportsAnalytics />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
import { useEffect } from "react";

function App() {

  useEffect(() => {
    fetch("http://localhost:5000/students")
      .then(res => res.json())
      .then(data => {
        console.log("Students:", data);
      });
  }, []);

  return <h1>Check console</h1>;
}

export default App;
import { useEffect, useState } from "react";

function App() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/students")
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setStudents(data);
      });
  }, []);

  return (
    <div>
      <h1>Students</h1>
      {students.map((s) => (
        <p key={s.student_id}>{s.name} - {s.cgpa}</p>
      ))}
    </div>
  );
}

export default App;
import { useEffect, useState } from "react";

function App() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/students")
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setStudents(data);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Students List</h1>

      {students.length === 0 ? (
        <p>No data found</p>
      ) : (
        students.map((s) => (
          <div key={s.student_id}>
            <p>{s.name} - {s.cgpa}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default App;
