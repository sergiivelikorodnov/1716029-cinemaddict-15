import { TEXT_DESCRIPTION } from '../const.js';
import { getRandomInteger, shuffle } from '../utils';
import dayjs from 'dayjs';

const textGenerator = TEXT_DESCRIPTION.split('. ');
const generateCommentText = (textArray) =>
  `${shuffle(textArray).slice(0, 1).join('. ')}.`;

const generateID = () =>
  (
    Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
  ).toUpperCase();

const generateCoomentDate = () => {
  const date1 = dayjs().add(getRandomInteger(-200, 0), 'days');
  const now = dayjs();
  if (now.diff(date1, 'years') > 1) {
    return `${now.diff(date1, 'years')} years ago`;
  } else if (now.diff(date1, 'months') < 12 && now.diff(date1, 'months') > 1) {
    return `${now.diff(date1, 'months')} months ago`;
  } else if (now.diff(date1, 'weeks') < 8 && now.diff(date1, 'weeks') > 1) {
    return `${now.diff(date1, 'weeks')} weeks ago`;
  } else if (now.diff(date1, 'days') < 8 && now.diff(date1, 'days') > 1) {
    return `${now.diff(date1, 'days')} days ago`;
  } else {
    return 'Today';
  }
};

const getAuthor = () => {
  const titles = [
    'Marjan Kohek',
    'Aljosa Novak',
    'Noe Aihmajer',
    'Tina Kogel',
    'Katja Mucek',
    'Tina Novograsek',
    'Mila Hofer',
  ];

  const getRandomIndex = getRandomInteger(0, titles.length - 1);
  return titles[getRandomIndex];
};

const getEmotion = () => {
  const emotions = ['smile', 'sleeping', 'puke', 'angry'];

  const getRandomIndex = getRandomInteger(0, emotions.length - 1);
  return emotions[getRandomIndex];
};

export const generateComment = () => ({
  id: generateID(),
  author: getAuthor(),
  comment: generateCommentText(textGenerator),
  date: generateCoomentDate(),
  emotion: getEmotion(),
});
