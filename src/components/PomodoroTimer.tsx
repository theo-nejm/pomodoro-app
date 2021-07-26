import React, { useState, useCallback, useEffect } from 'react';
import { useInterval } from '../hooks/useInterval';
import { secondsToTime } from '../utils/secondsToTime';
import { Button } from './Button';
import { Timer } from './Timer';

interface PomodoroTimerType {
  pomodoroTime: number;
  shortRestTime: number;
  longRestTime: number;
  cycles: number;
}

export function PomodoroTimer(props: PomodoroTimerType): JSX.Element {
  const [mainTime, setMainTime] = useState(props.pomodoroTime);
  const [isCounting, setIsCounting] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [cycles, setCycles] = useState(new Array(props.cycles - 1).fill(true));
  const [completedCycles, setCompletedCycles] = useState(0);
  const [workingTime, setWorkingTime] = useState(0);
  const [numberOfPomodoros, setNumberOfPomodoros] = useState(0);

  useInterval(
    () => {
      setMainTime(mainTime - 1);
      if (isWorking) setWorkingTime(workingTime + 1);
    },
    isCounting ? 1000 : null,
  );

  const configureWorkingStage = useCallback(() => {
    setIsCounting(true);
    setIsWorking(true);
    setIsResting(false);
    setMainTime(props.pomodoroTime);
  }, [
    setIsCounting,
    setIsWorking,
    setIsResting,
    setMainTime,
    props.pomodoroTime,
  ]);

  const configureRestingStage = useCallback(
    (long: boolean) => {
      setIsCounting(true);
      setIsWorking(false);
      setIsResting(true);

      long ? setMainTime(props.longRestTime) : setMainTime(props.shortRestTime);
    },
    [
      setIsCounting,
      setIsWorking,
      setIsResting,
      props.longRestTime,
      props.shortRestTime,
    ],
  );

  const configurePauseStage = useCallback(() => {
    setIsCounting(!isCounting);
  }, [setIsCounting]);

  useEffect(() => {
    if (isWorking) document.body.classList.add('working');
    if (isResting) document.body.classList.remove('working');

    if (mainTime > 0) return;

    if (isWorking && cycles.length > 0) {
      configureRestingStage(false);
      cycles.pop();
    } else if (isWorking && cycles.length <= 0) {
      configureRestingStage(true);
      setCycles(new Array(props.cycles - 1).fill(true));
      setCompletedCycles(completedCycles + 1);
    }

    if (isWorking) setNumberOfPomodoros(numberOfPomodoros + 1);
    if (isResting) configureWorkingStage();
  }, [
    isWorking,
    isResting,
    mainTime,
    configureRestingStage,
    configureWorkingStage,
    cycles,
    numberOfPomodoros,
    props.cycles,
    completedCycles,
  ]);

  return (
    <div className="pomodoro">
      <h2>Você está: {isWorking ? 'trabalhando' : 'descansando'}</h2>
      <Timer mainTime={mainTime}></Timer>
      <div className="controls">
        <Button
          text="Start"
          className="teste"
          onClick={() => configureWorkingStage()}
        />
        <Button
          text="Rest"
          className="teste"
          onClick={() => configureRestingStage(true)}
        />
        <Button
          className={!isWorking && !isResting ? 'hidden' : ''}
          text={isCounting ? 'Pause' : 'Play'}
          onClick={() => configurePauseStage()}
        />
      </div>
      <div className="details">
        <p>Ciclos concluídos: {completedCycles}</p>
        <p>Tempo trabalhado: {secondsToTime(workingTime)}</p>
        <p>Pomodoros concluídos: {numberOfPomodoros}</p>
      </div>
    </div>
  );
}
