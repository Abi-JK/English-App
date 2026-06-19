import React from 'react';
import { Menu } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ toggleMobileMenu, theme, setTheme }) => {
  return (
    <header className="top-header" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 20px',
      background: 'var(--surface-color)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)',
    }}>
      <button className="mobile-menu-btn" onClick={toggleMobileMenu} style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--text-primary)',
      }} aria-label="Open menu">
        <Menu size={24} />
      </button>
      <div style={{ fontWeight: '600', fontSize: '18px', color: 'var(--text-primary)' }}>
        Aura English
      </div>
      <ThemeToggle theme={theme} setTheme={setTheme} />
    </header>
  );
};

export default Navbar;
