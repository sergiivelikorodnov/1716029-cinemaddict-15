import { MINUTES_IN_HOUR } from '../const.js';

export const timeConvertor = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / MINUTES_IN_HOUR);
  const minutes = totalMinutes % MINUTES_IN_HOUR;
  return `${hours}h ${minutes} min`;
};

export const removeObjectFromSet = (set, obj) =>
  new Set([...set].filter((el) => JSON.stringify(el) !== JSON.stringify(obj)));
