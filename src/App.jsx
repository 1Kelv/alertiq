import { useState } from 'react';
import { useTheme } from './hooks/useTheme';
import Topbar from './components/Topbar';
import Landing from './components/Landing';
import Simulator from './components/Simulator';
import ComplianceSimulator from './components/ComplianceSimulator';
import TrainerDashboard from './components/TrainerDashboard';
import FraudTypesLesson from './components/FraudTypesLesson';
import StudentProgress from './components/StudentProgress';

export default function App() {
  const { theme, toggle } = useTheme();
  const [screen, setScreen]               = useState('home');
  const [simMode, setSimMode]             = useState('set1');
  const [complianceModule, setComplianceModule] = useState('idv');

  function startSim(mode) {
    if (mode === 'lesson')   { setScreen('lesson');   window.scrollTo(0,0); return; }
    if (mode === 'progress') { setScreen('progress'); window.scrollTo(0,0); return; }
    setSimMode(mode); setScreen('sim'); window.scrollTo(0,0);
  }
  function startCompliance(mod) { setComplianceModule(mod); setScreen('compliance'); window.scrollTo(0,0); }
  function goHome()              { setScreen('home'); window.scrollTo(0,0); }
  function goTrainer()           { setScreen('trainer'); window.scrollTo(0,0); }

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
        onStartTraining={() => startSim('lesson')}
        onTrainer={goTrainer}
      />

      {screen === 'home'       && <Landing onStart={startSim} onCompliance={startCompliance} onTrainer={goTrainer} />}
      {screen === 'lesson'     && <FraudTypesLesson onComplete={() => startSim('set1')} onHome={goHome} />}
      {screen === 'sim'        && <Simulator key={simMode} initialMode={simMode} onHome={goHome} />}
      {screen === 'compliance' && <ComplianceSimulator key={complianceModule} initialModule={complianceModule} onHome={goHome} />}
      {screen === 'trainer'    && <TrainerDashboard onBack={goHome} />}
      {screen === 'progress'   && <StudentProgress onHome={goHome} />}
    </>
  );
}
