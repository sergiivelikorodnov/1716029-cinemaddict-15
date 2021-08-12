

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomFloat = (min, max, exp) =>
  (Math.random() * (max - min) + min).toFixed(exp);

export const shuffle = (arr) =>
  arr
    .map((i) => [Math.random(), i])
    .sort()
    .map((i) => i[1]);

export const timeConvertor = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes} min`;
};

export const removeMyListener = (container, evt, handler) => {
  container.removeEventListener(evt, handler);
};
