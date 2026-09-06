import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { HeaderBar } from './components/HeaderBar';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { SkillAssessmentPage } from './pages/student/SkillAssessmentPage';
import { SkillProfilePage } from './pages/student/SkillProfilePage';
import { OpportunitiesMarketplace } from './pages/student/OpportunitiesMarketplace';
import { ApplicationsTrackerPage } from './pages/student/ApplicationsTrackerPage';
import { LearningProgramsPage } from './pages/student/LearningProgramsPage';
import { DigitalPortfolioPage } from './pages/student/DigitalPortfolioPage';
import { StudentMessagesPage } from './pages/student/StudentMessagesPage';

// Industry Pages
import { IndustryDashboard } from './pages/industry/IndustryDashboard';
import { PostOpportunityPage } from './pages/industry/PostOpportunityPage';
import { ApplicantsManagerPage } from './pages/industry/ApplicantsManagerPage';
import { IndustryCoursesPage } from './pages/industry/IndustryCoursesPage';

// Academician Pages
import { AcademicianDashboard } from './pages/academician/AcademicianDashboard';
import { AcademicOpportunitiesPage } from './pages/academician/AcademicOpportunitiesPage';

// Institution Pages
import { InstitutionDashboard } from './pages/institution/InstitutionDashboard';
import { InstitutionAnalyticsPage } from './pages/institution/InstitutionAnalyticsPage';

// Super Admin Page
import { AIIASuperAdminDashboard } from './pages/admin/AIIASuperAdminDashboard';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-ayush-bg font-sans">
          
          {/* Government credibility header strip */}
          <HeaderBar />

          {/* Navigation Bar */}
          <Navbar />

          {/* Body Container with optional Sidebar */}
          <div className="flex-1 flex max-w-7xl w-full mx-auto">
            <Sidebar />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/profile/settings" element={<ProfileSettingsPage />} />

                {/* Student Portal */}
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/skill-assessment" element={<SkillAssessmentPage />} />
                <Route path="/student/skill-profile" element={<SkillProfilePage />} />
                <Route path="/student/opportunities" element={<OpportunitiesMarketplace />} />
                <Route path="/student/applications" element={<ApplicationsTrackerPage />} />
                <Route path="/student/learning" element={<LearningProgramsPage />} />
                <Route path="/student/portfolio" element={<DigitalPortfolioPage />} />
                <Route path="/student/messages" element={<StudentMessagesPage />} />

                {/* Industry Partner Portal */}
                <Route path="/industry/dashboard" element={<IndustryDashboard />} />
                <Route path="/industry/post-opportunity" element={<PostOpportunityPage />} />
                <Route path="/industry/applicants" element={<ApplicantsManagerPage />} />
                <Route path="/industry/learning-programs" element={<IndustryCoursesPage />} />

                {/* Academician Portal */}
                <Route path="/academician/dashboard" element={<AcademicianDashboard />} />
                <Route path="/academician/opportunities" element={<AcademicOpportunitiesPage />} />

                {/* Institution Portal */}
                <Route path="/institution/dashboard" element={<InstitutionDashboard />} />
                <Route path="/institution/analytics" element={<InstitutionAnalyticsPage />} />

                {/* AIIA Super Admin Portal */}
                <Route path="/admin/dashboard" element={<AIIASuperAdminDashboard />} />
              </Routes>
            </main>
          </div>

          {/* Footer */}
          <Footer />

        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
