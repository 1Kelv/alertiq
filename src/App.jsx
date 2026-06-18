import { useState } from 'react';
import { useTheme } from './hooks/useTheme';
import Topbar from './components/Topbar';
import Landing from './components/Landing';
import Simulator from './components/Simulator';

export default function App() {
  const { theme, toggle } = useTheme();
  const [screen, setScreen] = useState('home');
  const [simMode, setSimMode] = useState('set1');

  function startSim(mode) {
    setSimMode(mode);
    setScreen('sim');
    window.scrollTo(0, 0);
  }

  function goHome() {
    setScreen('home');
    window.scrollTo(0, 0);
  }

  return (
    <>
      <div className="print-header">
        <h1>AlertIQ — Performance Report</h1>
        <p id="printMeta"></p>
      </div>
      <Topbar
        theme={theme}
        onToggleTheme={toggle}
        screen={screen}
        onHome={goHome}
        onStartTraining={() => startSim('set1')}
      />
      {screen === 'home' && <Landing onStart={startSim} />}
      {screen === 'sim'  && <Simulator key={simMode} initialMode={simMode} onHome={goHome} />}
    </>
  );
}
