import React from 'react';
import workerScript from "./worker.js";

const timerWorker = new Worker(workerScript);

export default function Timer() {
  const [timeRemaining, setTimeRemaining] = useState({
    minutes: null,
    seconds: null,
  });
  const { minutes, seconds } = timeRemaining;

  useEffect(() => {
    setTimeRemaining({ minutes: 5, seconds: 0 });

    timerWorker.postMessage("start");

    timerWorker.onmessage = (e) => {
      const {
        data: { minutes, seconds },
      } = e;
      setTimeRemaining({ minutes: minutes, seconds: seconds });

      if (minutes === 0 && seconds === 0) {
        timerWorker.postMessage("stop");
        setTimeRemaining({ minutes: null, seconds: null });
        return;
      }

      if (minutes === null && seconds === null) {
        return;
      }
    };

    return () => {
      timerWorker.postMessage("stop");
    };
  }, []);

  return (
    <div>
      {minutes ?? 0}:{seconds < 10 ? `0${seconds ?? 0}` : seconds}
    </div>
  );
}
