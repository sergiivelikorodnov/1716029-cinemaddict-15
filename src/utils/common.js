import dayjs from 'dayjs';
import { MINUTES_IN_HOUR } from '../const.js';

export const getHoursMinsTime = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / MINUTES_IN_HOUR);
  const minutes = totalMinutes % MINUTES_IN_HOUR;
  return `${hours}h ${minutes} min`;
};

export const getMinutesFromHours = (movies) => {
  const totalMinutes = movies.reduce((total, movie) => total + movie.runTime, 0);
  const hours = Math.floor(totalMinutes / MINUTES_IN_HOUR);
  const minutes = totalMinutes % MINUTES_IN_HOUR;
  return { hours, minutes};
};

export const getHumanTime = (time) => {
  const now = dayjs();
  if (now.diff(time, 'years') > 1) {
    return `${now.diff(time, 'years')} years ago`;
  } else if (now.diff(time, 'months') < 12 && now.diff(time, 'months') > 1) {
    return `${now.diff(time, 'months')} months ago`;
  } else if (now.diff(time, 'weeks') < 8 && now.diff(time, 'weeks') > 1) {
    return `${now.diff(time, 'weeks')} weeks ago`;
  } else if (now.diff(time, 'days') < 8 && now.diff(time, 'days') > 1) {
    return `${now.diff(time, 'days')} days ago`;
  }

  return 'Today';
};

export const getReleaseDate = (date) => dayjs(date).format('DD MMMM YYYY');

export const isOnline = () => window.navigator.onLine;
