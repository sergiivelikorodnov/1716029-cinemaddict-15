import { TEXT_DESCRIPTION } from '../const.js';
import {
  getRandomFloat,
  getRandomInteger,
  shuffle,
  timeConvertor
} from '../utils';
import dayjs from 'dayjs';

const getMovieTitle = () => {
  const titles = [
    'The Dance of Life',
    'Sagebrush Trail',
    'The Man with the Golden Arm',
    'Santa Claus Conquers the Martians',
    'Popeye the Sailor Meets Sindbad the Sailor',
  ];

  const getRandomIndex = getRandomInteger(0, titles.length - 1);
  return titles[getRandomIndex];
};

const getAltMovieTitle = () => {
  const titles = [
    'Alt The Dance of Life',
    'Alt Sagebrush Trail',
    'Alt The Man with the Golden Arm',
    'Alt Santa Claus Conquers the Martians',
    'Alt Popeye the Sailor Meets Sindbad the Sailor',
  ];

  const getRandomIndex = getRandomInteger(0, titles.length - 1);
  return titles[getRandomIndex];
};

const getMoviePoster = () => {
  const posters = [
    './images/posters/made-for-each-other.png',
    './images/posters/popeye-meets-sinbad.png',
    './images/posters/sagebrush-trail.jpg',
    './images/posters/the-dance-of-life.jpg',
    './images/posters/santa-claus-conquers-the-martians.jpg',
  ];

  const getRandomIndex = getRandomInteger(0, posters.length - 1);
  return posters[getRandomIndex];
};

const textGenerator = TEXT_DESCRIPTION.split('. ');

const getMovieDescription = (textArray) =>
  `${shuffle(textArray).slice(0, 5).join('. ')}.`;

const generateRating = () => getRandomFloat(2, 10, 1);

const generateComments = (comments) => {
  const getRandomIndex = getRandomInteger(1, 4);
  return new Set(
    shuffle(comments)
      .slice(0, getRandomIndex)
      .map((comment) => comment.id),
  );
};

const generateID = () =>
  (
    Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
  ).toUpperCase();

const generateDateRelease = () =>
  dayjs().add(getRandomInteger(-100, 0), 'year').format('DD MMMM YYYY');

const generateRuntime = () =>
  timeConvertor(dayjs().toDate().getMinutes() + getRandomInteger(60, 120));

const generateDate = () => {
  const isDate = Boolean(getRandomInteger());

  if (!isDate) {
    return null;
  }
  return dayjs().add(getRandomInteger(-100, 0), 'year').toDate();
};

const getCountry = () => {
  const titles = ['USA', 'Canada', 'Finland', 'Germany', 'Spain'];

  const getRandomIndex = getRandomInteger(0, titles.length - 1);
  return titles[getRandomIndex];
};

const getAgeRating = () => {
  const titles = [0, 3, 6, 12, 18];

  const getRandomIndex = getRandomInteger(0, titles.length - 1);
  return titles[getRandomIndex];
};

const getDirector = () => {
  const titles = [
    'David Fincher',
    'Christopher Nolan',
    'Steven Spielberg',
    'Quentin Tarantino',
    'Martin Scorsese',
  ];

  const getRandomIndex = getRandomInteger(0, titles.length - 1);
  return titles[getRandomIndex];
};

const getScreenWriters = () => {
  const titles = [
    'Billy Wilder',
    'Ethan Coen and Joel Coen',
    'Robert Towne',
    'Quentin Tarantino',
    'Francis Ford Coppola',
    'William Goldman',
    'Charlie Kaufman',
    'Woody Allen',
    'Nora Ephron',
    'Ernest Lehman',
  ];

  const getRandomIndex = getRandomInteger(1, 3);
  return shuffle(titles).slice(0, getRandomIndex);
};

const getActors = () => {
  const titles = [
    'Robin Williams',
    'Betty White',
    'Denzel Washington',
    'Tom Hanks',
    'Morgan Freeman',
    'Harrison Ford',
    'Sandra Bullock',
    'Sean Connery',
    'Jackie Chan',
    'Will Smith',
  ];

  const getRandomIndex = getRandomInteger(1, 5);
  return shuffle(titles).slice(0, getRandomIndex);
};

const getGenres = () => {
  const titles = [
    'Comedy',
    'Detective',
    'Drama',
    'Fantasy',
    'Crime',
    'Short',
    'Action',
    'Horror',
    'Western',
    'Adult',
  ];

  const getRandomIndex = getRandomInteger(1, 2);
  return shuffle(titles).slice(0, getRandomIndex);
};

export const generateMovie = (allComments) => {
  const dueDate = generateDate();
  const isWatchedStatus = dueDate !== null;

  return {
    id: generateID(),
    comments: generateComments(allComments),
    filmInfo: {
      title: getMovieTitle(),
      alternativeTitle: getAltMovieTitle(),
      totalRating: generateRating(),
      poster: getMoviePoster(),
      ageRating: getAgeRating(),
      director: getDirector(),
      writers: getScreenWriters(),
      actors: getActors(),
      release: {
        date: generateDateRelease(),
        country: getCountry(),
      },
      runTime: generateRuntime(),
      genre: getGenres(),
      description: getMovieDescription(textGenerator),
    },
    userDetails: {
      watchList: Boolean(getRandomInteger()),
      watchingDate: dueDate,
      alreadyWatched: isWatchedStatus,
      favorite: Boolean(getRandomInteger()),
    },
  };
};
