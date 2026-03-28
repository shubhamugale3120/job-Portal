import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import ProtectedRouter from './components/common/ProtectedRouter';
import RoleRoute from './components/common/RoleRoute';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import HomePage from './pages/home/HomePage';
import { JobsListPage } from './pages/jobs/JobsListPage';
import JobDetailPage from './pages/jobs/JobDetailPage';
import MyApplicationsPage from './pages/student/MyApplicationsPage';
import RecuiterDashboardPage from './pages/recuiter/RecuiterDashboardPage';
import MyJobsPage from './pages/recuiter/MyJobsPage';
import PostJobPage from './pages/recuiter/PostJobPage';
import ApplicantsPage from './pages/recuiter/ApplicantsPage';
import ForbiddenPage from './pages/common/ForbiddenPage';

function App() {
   return (
      <div className="app-shell">
         <Navbar />
         <main className="app-main">
         <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/jobs" element={<JobsListPage />} />
            <Route path="/jobs/:jobId" element={<JobDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route
               path="/student/applications"
               element={
                  <ProtectedRouter>
                     <RoleRoute allowedRoles={['student']}>
                        <MyApplicationsPage />
                     </RoleRoute>
                  </ProtectedRouter>
               }
            />

            <Route
               path="/recruiter/dashboard"
               element={
                  <ProtectedRouter>
                     <RoleRoute allowedRoles={['recruiter', 'admin']}>
                        <RecuiterDashboardPage />
                     </RoleRoute>
                  </ProtectedRouter>
               }
            />

            <Route
               path="/recruiter/my-jobs"
               element={
                  <ProtectedRouter>
                     <RoleRoute allowedRoles={['recruiter', 'admin']}>
                        <MyJobsPage />
                     </RoleRoute>
                  </ProtectedRouter>
               }
            />

            <Route
               path="/recruiter/post-job"
               element={
                  <ProtectedRouter>
                     <RoleRoute allowedRoles={['recruiter', 'admin']}>
                        <PostJobPage />
                     </RoleRoute>
                  </ProtectedRouter>
               }
            />

            <Route
               path="/recruiter/jobs/:jobId/applicants"
               element={
                  <ProtectedRouter>
                     <RoleRoute allowedRoles={['recruiter', 'admin']}>
                        <ApplicantsPage />
                     </RoleRoute>
                  </ProtectedRouter>
               }
            />

            <Route path="/forbidden" element={<ForbiddenPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
         </Routes>
         </main>
      </div>
   );
}

export default App
