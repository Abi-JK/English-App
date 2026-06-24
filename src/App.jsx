import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, UserCheck, MessageSquare, Award, Flame, Menu, X, Brain, FileText } from 'lucide-react';
import { useAppContext, AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import ThemeToggle from './components/ThemeToggle';

import Dashboard from './components/Dashboard';
import ExamCenter from './components/ExamCenter';
import InterviewPrep from './components/InterviewPrep';
import Conversation from './components/Conversation';
import LearningHub from './components/LearningHub';
import Resume from './components/Resume';

const App = () => {
  const { state } = useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <Router>
      <div className="app-container">
        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 999 }}
            onClick={closeMobileMenu}
          />
        )}

        {/* Sidebar */}
        <div className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <button className="close-sidebar-btn" onClick={closeMobileMenu}>
            <X size={24} />
          </button>
          <div className="logo-container">
            <div className="logo-icon" style={{ backgroundColor: 'var(--primary-color)', color: 'white', padding: '8px', borderRadius: '8px' }}>
              <BookOpen size={24} />
            </div>
            AuraEnglish
          </div>

          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px', paddingLeft: '8px' }}>
            LEARN
          </div>
          <ul className="nav-menu" style={{ marginBottom: '24px' }}>
            <NavLink to="/" end onClick={closeMobileMenu} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={20} /> Dashboard
            </NavLink>
            <NavLink to="/learn" onClick={closeMobileMenu} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Brain size={20} /> Learning Hub
            </NavLink>
            <NavLink to="/conversation" onClick={closeMobileMenu} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <MessageSquare size={20} /> Practice English
            </NavLink>
          </ul>

          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px', paddingLeft: '8px' }}>
            PREPARE
          </div>
          <ul className="nav-menu">
            <NavLink to="/exams" onClick={closeMobileMenu} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <BookOpen size={20} /> Competitive Exams
            </NavLink>
            <NavLink to="/interview" onClick={closeMobileMenu} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <UserCheck size={20} /> MNC Interview Prep
            </NavLink>
            <NavLink to="/resume" onClick={closeMobileMenu} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <FileText size={20} /> Resume Builder & Review
            </NavLink>
          </ul>

          <div style={{ marginTop: 'auto', padding: '16px', background: 'rgba(0,150,136,0.08)', borderRadius: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>🎯</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Study Daily. Grow Faster.</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <Navbar toggleMobileMenu={toggleMobileMenu} theme={theme} setTheme={setTheme} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
                <Menu size={24} />
              </button>
              <div className="stats" style={{ display: 'flex', gap: '16px' }}>
                <div className="stat-item" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-color)', fontSize: '14px' }}>
                  <Flame size={18} /> <strong>{state.streak}</strong> Day Streak
                </div>
                <div className="stat-item" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary-color)', fontSize: '14px' }}>
                  <Award size={18} /> <strong>Lvl {state.user.level}</strong> ({state.xp} XP)
                </div>
              </div>
            </div>
            <div className="user-profile">
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: '600', fontSize: '14px' }}>{state.user.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{state.user.targetGoal}</div>
              </div>
              <div className="user-avatar">
                {state.user.name.charAt(0)}
              </div>
            </div>
    

          <main className="view-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/learn" element={<LearningHub />} />
              <Route path="/exams" element={<ExamCenter />} />
              <Route path="/interview" element={<InterviewPrep />} />
              <Route path="/conversation" element={<Conversation />} />
              <Route path="/resume" element={<Resume />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
