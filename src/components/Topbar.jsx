export default function Topbar({ theme, onToggleTheme, screen, onHome, onStartTraining }) {
  return (
    <nav className="topbar">
      <div className="topbar-logo" onClick={onHome}>
        🔍 Alert<span>IQ</span>
      </div>
      <div className="topbar-right">
        <span className="theme-label">{theme === 'dark' ? 'Dark' : 'Light'}</span>
        <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme" />
        {screen !== 'home' && (
          <button className="topbar-nav-btn" onClick={onHome}>← Home</button>
        )}
        {screen === 'home' && (
          <button className="topbar-nav-btn primary" onClick={onStartTraining}>Start Training</button>
        )}
      </div>
    </nav>
  );
}
