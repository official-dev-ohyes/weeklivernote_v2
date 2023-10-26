export function calculateTimeDifference(targetDate: Date): number {
  const currentTime = new Date();
  const differenceInMilliseconds = currentTime.getTime() - targetDate.getTime();

  const millisecondsInOneHour = 1000 * 60 * 60;
  const hoursDifference = differenceInMilliseconds / millisecondsInOneHour;

  const roundedHoursDifference = Math.floor(hoursDifference);

  return roundedHoursDifference;
}
