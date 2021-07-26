import React from 'react';
import { secondsToTime } from '../utils/secondsToTime';

interface TimerProps {
  mainTime: number;
}

export function Timer(props: TimerProps): JSX.Element {
  return <div className="timer">{secondsToTime(props.mainTime)}</div>;
}
