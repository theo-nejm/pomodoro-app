export function secondsToTime(seconds: number): string {
  const addLeftZero = (number: number) =>
    Math.floor(number).toString().padStart(2, '0');
  const currentHours = addLeftZero((seconds / 3600) % 3600);
  const currentMinutes = addLeftZero((seconds / 60) % 60);
  const currentSeconds = addLeftZero(seconds % 60);

  if (seconds >= 3600)
    return `${currentHours}:${currentMinutes}:${currentSeconds}`;
  if (seconds >= 60) return `${currentMinutes}:${currentSeconds}`;
  return currentSeconds;
}
