import TimerApp from "./TimerApp";
import TimerContext from "./TimerContext";
import { useState, useEffect } from "react";

function App() {
  const [screenTime, setScreenTime] = useState(20);
  const [breakTime, setBreakTime] = useState(20);
  const [cycle, setCycle] = useState(1);
  const [mode, setMode] = useState("screen");
  const [secondsLeft, setSecondsLeft] = useState(screenTime * 60);
  const [cyclesLeft, setCyclesLeft] = useState(0);

  useEffect(() => {
    setSecondsLeft(screenTime * 60);
  }, [screenTime]);

  return (
    <TimerContext.Provider
      value={{
        screenTime,
        setScreenTime,
        breakTime,
        setBreakTime,
        cycle,
        setCycle,
        mode,
        setMode,
        secondsLeft,
        setSecondsLeft,
        cyclesLeft,
        setCyclesLeft,
      }}
    >
      <TimerApp />;
    </TimerContext.Provider>
  );
}

export default App;
