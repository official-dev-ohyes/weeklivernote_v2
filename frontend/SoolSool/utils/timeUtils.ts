export function getAdjustedDate(date) {
  const now = new Date(date);

  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  if (currentHour < 5 || (currentHour === 5 && currentMinute === 0)) {
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    return yesterday;
  }

  return now;
}

export function getToday(): string {
  const today = new Date();
  const adjustedToday = getAdjustedDate(today);
  const year = adjustedToday.getFullYear();
  const month = (adjustedToday.getMonth() + 1).toString().padStart(2, "0");
  const day = adjustedToday.getDate().toString().padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}

export function calculateTimeDifference(targetDate: Date): number {
  const currentTime = new Date();
  const differenceInMilliseconds = currentTime.getTime() - targetDate.getTime();

  const millisecondsInOneHour = 1000 * 60 * 60;
  const hoursDifference = differenceInMilliseconds / millisecondsInOneHour;

  // const roundedHoursDifference = Math.floor(hoursDifference);
  const roundedHoursDifference = Math.round(hoursDifference * 10) / 10;

  return roundedHoursDifference;
}

export function calculateTimeAfterHours(startTime: string, hoursToAdd: number) {
  const now = new Date();
  const referenceTime = new Date(startTime);
  const millisecondsToAdd = hoursToAdd * 3600000;
  const newTime = new Date(referenceTime.getTime() + millisecondsToAdd);

  if (newTime <= now) {
    return "passed";
  }

  const currentYear = referenceTime.getFullYear();
  const currentMonth = referenceTime.getMonth();
  const currentDay = referenceTime.getDate();

  const newYear = newTime.getFullYear();
  const newMonth = newTime.getMonth();
  const newDay = newTime.getDate();

  const hours = newTime.getHours();
  const minutes = newTime.getMinutes();

  const timeDifference = newTime.getTime() - now.getTime();
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  if (daysDifference > 1) {
    return `${daysDifference}일 후 ${hours < 10 ? `0${hours}` : hours}:${
      minutes < 10 ? `0${minutes}` : minutes
    }`;
  } else if (
    currentYear === newYear &&
    currentMonth === newMonth &&
    currentDay === newDay
  ) {
    return `오늘 ${hours < 10 ? `0${hours}` : hours}:${
      minutes < 10 ? `0${minutes}` : minutes
    }`;
  } else {
    return `내일 ${hours < 10 ? `0${hours}` : hours}:${
      minutes < 10 ? `0${minutes}` : minutes
    }`;
  }
}
