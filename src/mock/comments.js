import { getRandomInteger, shuffle } from '../utils';
import dayjs from 'dayjs';

const TEXT_COMMENTS =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus';


const textGenerator = TEXT_COMMENTS.split('. ');
const generateCommentText = (textArray) =>
  `${shuffle(textArray).slice(0, 1).join('. ')}.`;

const generateID = () =>
  (
    Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
  ).toUpperCase();

const generateCommentDate = () => {
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

const generateComment = () => ({
  id: generateID(),
  author: getAuthor(),
  comment: generateCommentText(textGenerator),
  date: generateCommentDate(),
  emotion: getEmotion(),
});

/**
 * All Comments
 */
const COMMENTS_TOTAL_COUNT = 20;
const allComments = new Array(COMMENTS_TOTAL_COUNT).fill().map(generateComment);

export { allComments };
