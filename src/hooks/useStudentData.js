// src/hooks/useStudentData.js
// Shared hook — fetches the logged-in student's real data from MySQL via API
// Used by: StudentDashboard, StudentProfile, Sidebar, PerformanceTracking, etc.

import { useState, useEffect } from 'react';
import { getToken, getUser, logout } from '../services/api';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function useStudentData() {
    const [student, setStudent] = useState(null);   // full DB record
    const [performance, setPerformance] = useState(null);   // from performance table
    const [applications, setApplications] = useState([]);   // student's applications
    const [drives, setDrives] = useState([]);     // all active drives
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = getToken();
        if (!token) { logout(); return; }

        const headers = { Authorization: `Bearer ${token}` };

        async function fetchAll() {
            try {
                setLoading(true);

                // 1. Student profile (includes performance row)
                const profileRes = await fetch(`${BASE}/student/profile`, { headers });
                const profileData = await profileRes.json();

                if (!profileData.success) {
                    // Token expired or invalid
                    if (profileRes.status === 401 || profileRes.status === 403) logout();
                    throw new Error(profileData.message || 'Failed to load profile');
                }

                setStudent(profileData.data.student);
                setPerformance(profileData.data.performance || null);

                // 2. Student's own applications
                const appRes = await fetch(`${BASE}/student/applications`, { headers });
                const appData = await appRes.json();
                if (appData.success) setApplications(appData.data || []);

                // 3. Active job drives (includes eligibility flag)
                const drivesRes = await fetch(`${BASE}/drives`, { headers });
                const drivesData = await drivesRes.json();
                if (drivesData.success) setDrives(drivesData.data || []);

            } catch (err) {
                setError(err.message || 'Failed to load data');
            } finally {
                setLoading(false);
            }
        }

        fetchAll();
    }, []);

    return { student, performance, applications, drives, loading, error, setStudent };
}
