import React, { useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ theme, setTheme }) => {
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Sync on mount in case theme changed outside
  useEffect(() => {
    const stored = localStorage.getItem('theme') || 'dark';
    if (stored !== theme) setTheme(stored);
  }, []);

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark/light theme"
      className="theme-toggle btn-icon"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px',
        borderRadius: '9999px',
        background: 'var(--card-bg)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-color)',
        cursor: 'pointer',
        transition: 'transform 0.2s',
      }}
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default ThemeToggle;
