const worker = () => {
  let timerIntervalID = null;
  let minutes = 5;
  let seconds = 0;

  self.onmessage = (e) => {
    const { data } = e;
    if (data === "start") {
      postMessage({ minutes: minutes - 1, seconds: 59 });

      timerIntervalID = setInterval(() => {
        if (seconds > 0) {
          seconds = seconds - 1;
          postMessage({ minutes, seconds: seconds });
        }

        if (seconds === 0) {
          if (minutes > 0) {
            minutes = minutes - 1;
            seconds = 59;
            postMessage({ minutes: minutes, seconds: seconds });
          } else {
            postMessage({ minutes: 0, seconds: 0 });
          }
        }
      }, 1000);
    }

    if (data === "stop") {
      clearInterval(timerIntervalID);
    }
  };
};

let code = worker.toString();
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

const blob = new Blob([code], { type: "application/javascript" });
const workerScript = URL.createObjectURL(blob);

module.exports = workerScript;
