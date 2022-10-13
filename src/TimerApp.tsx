import { useCallback, useEffect, useState } from "react";
import Button from "./components/Button";
import Input from "./components/Input";
import { FiPlay, FiPause, FiRefreshCw } from "react-icons/fi";

const TimerApp = () => {
  const [screenTime, setScreenTime] = useState<number>(20);
  const [breakTime, setBreakTime] = useState<number>(20);
  const [cycle, setCycle] = useState<number>(3);
  const [runST, setRunST] = useState<number>(() => screenTime * 60);
  const [runBT, setRunBT] = useState<number>(() => breakTime);
  const [runCyc, setRunCyc] = useState<number>(0);
  const [start, setStart] = useState<boolean>(false);
  const [notifPermission, setNotifPermission] = useState<string>("");

  const addScreenTime = () => {
    setScreenTime((prev: number) => {
      if (prev < 60) {
        return prev + 20;
      }
      return prev;
    });
  };

  const minScreenTime = () => {
    setScreenTime((prev: number) => {
      if (prev > 20) {
        return prev - 20;
      }
      return prev;
    });
  };

  const addBreakTime = () => {
    setBreakTime((prev: number) => {
      if (prev < 40) {
        return prev + 10;
      }
      return prev;
    });
  };

  const minBreakTime = () => {
    setBreakTime((prev: number) => {
      if (prev > 20) {
        return prev - 10;
      }
      return prev;
    });
  };

  const addCycle = () => {
    setCycle((prev: number) => {
      if (prev < 5) {
        return prev + 1;
      }
      return prev;
    });
  };

  const minCycle = () => {
    setCycle((prev: number) => {
      if (prev > 1) {
        return prev - 1;
      }
      return prev;
    });
  };

  const refreshTimer = () => {
    setStart(false);
    setRunST(screenTime * 60);
    setRunBT(breakTime);
    setRunCyc(0);
  };

  const showNotification = useCallback(() => {
    if (notifPermission === "granted") {
      navigator.serviceWorker.ready.then((reg) => {
        reg.showNotification("Times Up!", {
          body: `Times up!, Break time for ${breakTime} seconds`,
          data: {
            primaryKey: 1,
          },
          actions: [
            {
              action: "explore",
              title: "Go to site",
            },
            {
              action: "close",
              title: "Ok",
            },
          ],
        });
      });
    }
  }, [breakTime, notifPermission]);

  useEffect(() => {
    setRunST(screenTime * 60);
    setRunBT(breakTime);
  }, [screenTime, breakTime]);

  useEffect(() => {
    Notification.requestPermission((result) => {
      setNotifPermission(result);
    });
  }, []);

  useEffect(() => {
    let intvST: any;
    let intvBT: any;
    if (start) {
      intvST = setInterval(() => {
        if (runST > 0) {
          setRunST((prev: number) => {
            if (prev > 0) {
              return prev - 1;
            }
            return prev;
          });
        } else {
          clearInterval(intvST);
        }
      }, 1000);
      intvBT = setInterval(() => {
        if (runST === 0) {
          setRunBT((prev: number) => {
            if (prev > 0) {
              return prev - 1;
            }
            return prev;
          });
          if (runBT === 0) {
            clearInterval(intvBT);
          }
        }
      }, 1000);
    }

    return () => {
      clearInterval(intvST);
      clearInterval(intvBT);
    };
  }, [start, runST, runBT]);

  useEffect(() => {
    for (let i = 0; i <= cycle; i++) {
      if (runBT === 0) {
        setTimeout(() => {
          setRunST(screenTime * 60);
          setRunBT(breakTime);
          setRunCyc(runCyc + 1);
        }, 3000);
      }
      if (runCyc >= cycle) {
        setStart(false);
        setRunST(screenTime * 60);
        setRunBT(breakTime);
        setRunCyc(0);
      }
    }
  }, [runST, runBT, runCyc, screenTime, breakTime, cycle]);

  useEffect(() => {
    if (runST === 0) {
      showNotification();
    }
  }, [runST, showNotification]);

  useEffect(() => {
    if (runBT === 0) {
      if (notifPermission === "granted") {
        navigator.serviceWorker.ready.then((reg) => {
          reg.showNotification("Break done", {
            body: `Break done, Back to focus`,
            data: {
              primaryKey: 1,
            },
            actions: [
              {
                action: "explore",
                title: "Go to site",
              },
              {
                action: "close",
                title: "Ok",
              },
            ],
          });
        });
      }
    }
  }, [runBT, notifPermission]);

  useEffect(() => {
    if (runCyc === cycle) {
      if (notifPermission === "granted") {
        navigator.serviceWorker.ready.then((reg) => {
          reg.showNotification("Cycle completed!", {
            body: `Cycle completed, total cycle ${cycle}`,
            actions: [
              {
                action: "close",
                title: "Close",
              },
            ],
          });
        });
      }
    }
  }, [runCyc, cycle, notifPermission]);

  return (
    <div className="min-h-screen bg-slate-800 p-12">
      <div className="flex flex-col justify-center max-w-4xl mx-auto">
        <header>
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
            <div className="flex gap-8">
              <div className="flex flex-col max-w-xs mx-auto gap-2">
                <label htmlFor="" className="text-slate-200 text-xl">
                  Screen Time
                </label>
                <div className="flex">
                  <Input
                    type="text"
                    className="w-full text-2xl rounded-tr-none rounded-br-none"
                    value={`${screenTime} minutes`}
                    readOnly
                  />
                  <div className="flex flex-col justify-center">
                    <Button
                      onClick={addScreenTime}
                      className="basis-[50%] py-1 border-2 border-l-0 rounded-tr-md"
                      disabled={start ? true : false}
                    >
                      +
                    </Button>
                    <Button
                      onClick={minScreenTime}
                      className="basis-[50%] py-1 border-2 border-l-0 border-t-0 rounded-br-md"
                      disabled={start ? true : false}
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
                    value={`${breakTime} seconds`}
                    readOnly
                  />
                  <div className="flex flex-col justify-center">
                    <Button
                      onClick={addBreakTime}
                      className="basis-[50%] py-1 border-2 border-l-0 rounded-tr-md"
                      disabled={start ? true : false}
                    >
                      +
                    </Button>
                    <Button
                      onClick={minBreakTime}
                      className="basis-[50%] py-1 border-2 border-l-0 border-t-0 rounded-br-md"
                      disabled={start ? true : false}
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
                    value={`${cycle} times`}
                    readOnly
                  />
                  <div className="flex flex-col justify-center">
                    <Button
                      onClick={addCycle}
                      className="basis-[50%] py-1 border-2 border-l-0 rounded-tr-md"
                      disabled={start ? true : false}
                    >
                      +
                    </Button>
                    <Button
                      onClick={minCycle}
                      className="basis-[50%] py-1 border-2 border-l-0 border-t-0 rounded-br-md"
                      disabled={start ? true : false}
                    >
                      -
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-4 self-center">
              <Button
                onClick={() => setStart(!start)}
                className={`py-4 rounded-md ${
                  start
                    ? "bg-red-500 hover:bg-red-400"
                    : "bg-green-500 hover:bg-green-400"
                } group`}
              >
                {start ? (
                  <FiPause className="w-6 h-6 group-hover:scale-125 transition-all duration-300" />
                ) : (
                  <FiPlay className="w-6 h-6 group-hover:scale-125 transition-all duration-300" />
                )}
              </Button>
              <Button
                onClick={refreshTimer}
                className="py-2 rounded-md hover:bg-slate-600 group"
              >
                <FiRefreshCw className="w-6 h-6 group-hover:scale-125 transition-all duration-300" />
              </Button>
            </div>
          </div>
          <p className="text-7xl text-slate-200 text-center mt-8">
            {runST === 0
              ? `${
                  Math.floor(runBT / 60).toString().length === 1 ? "0" : ""
                }${Math.floor(runBT / 60)}:${
                  (runBT % 60).toString().length === 1 ? "0" : ""
                }${runBT % 60}`
              : `${
                  Math.floor(runST / 60).toString().length === 1 ? "0" : ""
                }${Math.floor(runST / 60)}:${
                  (runST % 60).toString().length === 1 ? "0" : ""
                }${runST % 60}`}
          </p>
          <p className="text-xl text-center text-slate-400 mt-4">
            Cycle : {runCyc + 1}
          </p>
          <div
            style={{
              width:
                runST === 0
                  ? `${(runBT / breakTime) * 100}%`
                  : `${(runST / (screenTime * 60)) * 100}%`,
              transition: "all",
              transitionDuration: runST === 0 ? "1000ms" : "1ms",
            }}
            className={`bg-slate-200 h-4 mt-6 mx-auto`}
          ></div>
        </main>
      </div>
    </div>
  );
};

export default TimerApp;
