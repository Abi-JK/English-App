import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, UserCheck, MessageSquare, X, Brain, FileText, PenSquare, Layers, Gamepad2, Mic, Headphones, BookMarked } from 'lucide-react';
import { useAppContext } from './context/AppContext';
import Navbar from './components/Navbar';

import Dashboard from './components/Dashboard';
import ExamCenter from './components/ExamCenter';
import InterviewPrep from './components/InterviewPrep';
import Conversation from './components/Conversation';
import LearningHub from './components/LearningHub';
import Resume from './components/Resume';
import WritingLab from './components/WritingLab';
import PhrasalVerbs from './components/PhrasalVerbs';
import VocabGames from './components/VocabGames';
import ListeningLab from './components/ListeningLab';
import ReadingLab from './components/ReadingLab';
import Bookmarks from './components/Bookmarks';

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
              <Mic size={24} />
            </div>
            SpeakUp
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
              <MessageSquare size={20} /> Practice Speaking
            </NavLink>
            <NavLink to="/games" onClick={closeMobileMenu} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Gamepad2 size={20} /> Vocab Games 🎮
            </NavLink>
            <NavLink to="/writing" onClick={closeMobileMenu} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <PenSquare size={20} /> Writing Lab
            </NavLink>
            <NavLink to="/phrasal" onClick={closeMobileMenu} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Layers size={20} /> Phrasal Verbs
            </NavLink>
            <NavLink to="/listening" onClick={closeMobileMenu} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Headphones size={20} /> Listening Lab
            </NavLink>
            <NavLink to="/reading" onClick={closeMobileMenu} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <BookOpen size={20} /> Reading Lab
            </NavLink>
            <NavLink to="/bookmarks" onClick={closeMobileMenu} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <BookMarked size={20} /> Bookmarks
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
              <FileText size={20} /> Resume Builder
            </NavLink>
          </ul>

          <div style={{ marginTop: 'auto', padding: '16px', background: 'rgba(0,150,136,0.08)', borderRadius: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>🎙️</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Speak up. Grow every day.</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <Navbar toggleMobileMenu={toggleMobileMenu} theme={theme} setTheme={setTheme} />

          <main className="view-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/learn" element={<LearningHub />} />
              <Route path="/exams" element={<ExamCenter />} />
              <Route path="/interview" element={<InterviewPrep />} />
              <Route path="/conversation" element={<Conversation />} />
              <Route path="/resume" element={<Resume />} />
              <Route path="/writing" element={<WritingLab />} />
              <Route path="/phrasal" element={<PhrasalVerbs />} />
              <Route path="/games" element={<VocabGames />} />
              <Route path="/listening" element={<ListeningLab />} />
              <Route path="/reading" element={<ReadingLab />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
