import { FiPause, FiPlay, FiRefreshCw } from "react-icons/fi";
import Button from "./components/Button";
import Input from "./components/Input";
import { useEffect, useState, useContext, useMemo } from "react";
import TimerContext from "./TimerContext";

const TimerApp = () => {
  const TimerConf = useContext<any>(TimerContext);
  const [isPaused, setIsPaused] = useState(true);

  const onClickSetScreenTimeHandler = (ev: any) => {
    if (ev.target.name === "add" && TimerConf.screenTime < 60) {
      TimerConf.setScreenTime(TimerConf.screenTime + 5);
    } else if (ev.target.name === "sub" && TimerConf.screenTime > 20) {
      TimerConf.setScreenTime(TimerConf.screenTime - 5);
    }
  };

  const onClickSetBreakTimeHandler = (ev: any) => {
    if (ev.target.name === "add" && TimerConf.breakTime < 60) {
      TimerConf.setBreakTime(TimerConf.breakTime + 5);
    } else if (ev.target.name === "sub" && TimerConf.breakTime > 20) {
      TimerConf.setBreakTime(TimerConf.breakTime - 5);
    }
  };

  const onClickSetCycleHandler = (ev: any) => {
    if (ev.target.name === "add" && TimerConf.cycle < 5) {
      TimerConf.setCycle(TimerConf.cycle + 1);
    } else if (ev.target.name === "sub" && TimerConf.cycle > 1) {
      TimerConf.setCycle(TimerConf.cycle - 1);
    }
  };

  const onClickRefreshTimer = () => {
    TimerConf.setSecondsLeft(TimerConf.screenTime * 60);
    TimerConf.setMode("screen");
    TimerConf.setCyclesLeft(0);
    setIsPaused(true);
  };

  const TimerTick: Worker = useMemo(
    () => new Worker(new URL("./TimerWorker.ts", import.meta.url)),
    []
  );

  useEffect(() => {
    if (window.Worker) {
      TimerTick.postMessage("tick");
    }
  }, [TimerTick]);

  useEffect(() => {
    if (window.Worker) {
      TimerTick.onmessage = (e: MessageEvent<string>) => {
        if (!isPaused) {
          if (TimerConf.secondsLeft === 0 && TimerConf.mode === "screen") {
            TimerConf.setMode("break");
          } else if (
            TimerConf.secondsLeft === 0 &&
            TimerConf.mode === "break"
          ) {
            TimerConf.setMode("screen");
          }

          TimerConf.setSecondsLeft((prevValue: any) => prevValue - 1);
        }
      };
    }
  }, [TimerTick, TimerConf, isPaused]);

  useEffect(() => {
    if (TimerConf.mode === "screen") {
      TimerConf.setSecondsLeft(TimerConf.screenTime * 60);
    } else if (TimerConf.mode === "break") {
      TimerConf.setSecondsLeft(TimerConf.breakTime);
    }
  }, [TimerConf.mode]);

  useEffect(() => {
    if (TimerConf.cyclesLeft < TimerConf.cycle) {
      if (TimerConf.mode === "break" && TimerConf.secondsLeft === 0) {
        TimerConf.setCyclesLeft((prev: any) => prev + 1);
        TimerConf.setMode("screen");
      }
    } else {
      TimerConf.setSecondsLeft(TimerConf.screenTime * 60);
      setIsPaused(true);
    }
  }, [TimerConf.mode, TimerConf.secondsLeft]);

  useEffect(() => {
    if (TimerConf.secondsLeft === 0 && TimerConf.mode === "screen") {
      showNotification(
        "Break time",
        `Look to an object for ${TimerConf.breakTime} seconds`
      );
    } else if (TimerConf.secondsLeft === 0 && TimerConf.mode === "break") {
      if (TimerConf.cyclesLeft + 1 === TimerConf.cycle) {
        console.log("Cycles Done!!, please start again");
        showNotification("Cycles Done", "You can start the timer again");
      } else {
        showNotification("Work Time", "You can continue your work");
      }
    }
  }, [TimerConf.secondsLeft]);

  useEffect(() => {
    Notification.requestPermission();
  }, []);

  const showNotification = (title: string, body: string) => {
    const notif = new Notification(title, { body });

    return setTimeout(() => {
      notif.close();
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-slate-800 p-12 pb-0">
      <div className="flex flex-col justify-center max-w-4xl mx-auto">
        <header className="max-w-2xl mx-auto">
          <h1 className="text-slate-200 text-4xl underline text-center mb-6">
            20-20-20 Timer
          </h1>
          <p className="text-slate-400 text-center text-xl">
            This is an app for help you to remind with 20-20-20 rules, that
            every 20 minutes you spend on looking screen then break for 20
            seconds and look to an object that far away about 20ft away from you
          </p>
        </header>
        <main className="py-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex flex-col max-w-xs mx-auto gap-2">
                <label htmlFor="" className="text-slate-200 text-xl">
                  Screen Time
                </label>
                <div className="flex">
                  <Input
                    type="text"
                    className="w-full text-2xl rounded-tr-none rounded-br-none"
                    value={`${TimerConf.screenTime} minutes`}
                    readOnly
                  />
                  <div className="flex flex-col justify-center">
                    <Button
                      onClick={(ev) => onClickSetScreenTimeHandler(ev)}
                      className="basis-[50%] py-1 border-2 border-l-0 rounded-tr-md"
                      name="add"
                    >
                      +
                    </Button>
                    <Button
                      onClick={(ev) => onClickSetScreenTimeHandler(ev)}
                      className="basis-[50%] py-1 border-2 border-l-0 border-t-0 rounded-br-md"
                      name="sub"
                    >
                      -
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col max-w-xs mx-auto gap-2">
                <label htmlFor="" className="text-slate-200 text-xl">
                  Break for
                </label>
                <div className="flex">
                  <Input
                    type="text"
                    className="w-full text-2xl rounded-tr-none rounded-br-none"
                    value={`${TimerConf.breakTime} seconds`}
                    readOnly
                  />
                  <div className="flex flex-col justify-center">
                    <Button
                      onClick={(ev) => onClickSetBreakTimeHandler(ev)}
                      className="basis-[50%] py-1 border-2 border-l-0 rounded-tr-md"
                      name="add"
                    >
                      +
                    </Button>
                    <Button
                      onClick={(ev) => onClickSetBreakTimeHandler(ev)}
                      className="basis-[50%] py-1 border-2 border-l-0 border-t-0 rounded-br-md"
                      name="sub"
                    >
                      -
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col max-w-xs mx-auto gap-2">
                <label htmlFor="" className="text-slate-200 text-xl">
                  Cycle
                </label>
                <div className="flex">
                  <Input
                    type="text"
                    className="w-full text-2xl rounded-tr-none rounded-br-none"
                    value={`${TimerConf.cycle} times`}
                    readOnly
                  />
                  <div className="flex flex-col justify-center">
                    <Button
                      onClick={(ev) => onClickSetCycleHandler(ev)}
                      className="basis-[50%] py-1 border-2 border-l-0 rounded-tr-md"
                      name="add"
                    >
                      +
                    </Button>
                    <Button
                      onClick={(ev) => onClickSetCycleHandler(ev)}
                      className="basis-[50%] py-1 border-2 border-l-0 border-t-0 rounded-br-md"
                      name="sub"
                    >
                      -
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-4 self-center">
              <Button
                onClick={() => setIsPaused(!isPaused)}
                className={`py-4 rounded-md ${
                  !isPaused
                    ? "bg-red-500 hover:bg-red-400"
                    : "bg-green-500 hover:bg-green-400"
                } group`}
              >
                {!isPaused ? (
                  <FiPause className="w-6 h-6 group-hover:scale-125 transition-all duration-300" />
                ) : (
                  <FiPlay className="w-6 h-6 group-hover:scale-125 transition-all duration-300" />
                )}
              </Button>
              <Button
                onClick={onClickRefreshTimer}
                className="py-2 rounded-md hover:bg-slate-600 group"
              >
                <FiRefreshCw className="w-6 h-6 group-hover:scale-125 transition-all duration-300" />
              </Button>
            </div>
          </div>
          <p className="text-2xl text-slate-200 text-center mt-8">
            {TimerConf.mode === "screen" ? "Screen Time" : "Break Time"}
          </p>
          <p className="text-7xl text-slate-200 text-center mt-2">
            <span>
              {Math.floor(TimerConf.secondsLeft / 60)}:
              {TimerConf.secondsLeft % 60 < 10 ? "0" : ""}
              {TimerConf.secondsLeft % 60}
            </span>
          </p>
          <p className="text-xl text-center text-slate-400 mt-4">
            Cycle : {TimerConf.cyclesLeft}
          </p>
          <div className={`bg-slate-200 h-4 mt-6 mx-auto`}></div>
        </main>
      </div>
    </div>
  );
};

export default TimerApp;
