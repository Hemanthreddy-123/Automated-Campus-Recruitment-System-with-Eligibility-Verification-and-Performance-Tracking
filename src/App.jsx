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
