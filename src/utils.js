const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomFloat = (min, max, exp) =>
  (Math.random() * (max - min) + min).toFixed(exp);

const shuffle = (arr) =>
  arr
    .map((i) => [Math.random(), i])
    .sort()
    .map((i) => i[1]);

const timeConvertor = (num) => {
  const hours = Math.floor(num / 60);
  const minutes = num % 60;
  return `${hours}h ${minutes} min`;
};

export { getRandomInteger, getRandomFloat, shuffle, timeConvertor };
