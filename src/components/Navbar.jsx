import React from 'react';
import { Menu, Flame, Award } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useAppContext } from '../context/AppContext';

const Navbar = ({ toggleMobileMenu, theme, setTheme }) => {
  const { state } = useAppContext();

  return (
    <header className="top-header" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 24px',
      background: 'var(--surface-color)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)',
      gap: '16px',
      zIndex: 90
    }}>
      {/* Left: Mobile Menu & App Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button className="mobile-menu-btn" onClick={toggleMobileMenu} style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-main)',
        }} aria-label="Open menu">
          <Menu size={24} />
        </button>
        <div style={{ fontWeight: '800', fontSize: '18px', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
          Aura English
        </div>
      </div>

      {/* Middle: User Stats */}
      <div className="stats-header" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px', 
          color: 'var(--accent-color)', 
          fontSize: '13px',
          fontWeight: '600',
          background: 'rgba(245, 158, 11, 0.08)',
          padding: '6px 12px',
          borderRadius: '20px',
          border: '1px solid rgba(245, 158, 11, 0.15)'
        }}>
          <Flame size={16} fill="currentColor" /> <span><strong>{state.streak}</strong> Day Streak</span>
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px', 
          color: 'var(--primary-color)', 
          fontSize: '13px',
          fontWeight: '600',
          background: 'rgba(0, 150, 136, 0.08)',
          padding: '6px 12px',
          borderRadius: '20px',
          border: '1px solid rgba(0, 150, 136, 0.15)'
        }}>
          <Award size={16} /> <span><strong>Lvl {state.user.level}</strong> ({state.xp} XP)</span>
        </div>
      </div>

      {/* Right: Theme Toggle & User Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <ThemeToggle theme={theme} setTheme={setTheme} />
        
        <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ textAlign: 'right' }} className="user-profile-text">
            <div style={{ fontWeight: '600', fontSize: '13px', color: 'var(--text-main)' }}>{state.user.name}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{state.user.targetGoal}</div>
          </div>
          <div className="user-avatar" style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary-color), var(--primary-hover))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: '800',
            fontSize: '13px',
            border: '2px solid var(--border-color)'
          }}>
            {state.user.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

