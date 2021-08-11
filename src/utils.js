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

export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREBEGIN: 'beforebegin',
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREBEGIN:
      container.append(element);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};
