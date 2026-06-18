import { useState, useEffect, useRef } from 'react';

export function useTimer(onExpire) {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            onExpireRef.current?.();
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const start = (s) => { setSeconds(s); setRunning(true); };
  const stop  = () => { clearInterval(intervalRef.current); setRunning(false); };
  const reset = () => { stop(); setSeconds(0); };

  const display = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  const urgency = seconds <= 60 ? 'crit' : seconds <= 300 ? 'warn' : '';

  return { seconds, display, urgency, running, start, stop, reset };
}
