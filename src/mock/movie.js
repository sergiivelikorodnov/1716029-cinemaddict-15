import { getRandomFloat, getRandomInteger, shuffle } from './utils.js';
import dayjs from 'dayjs';

const TEXT_DESCRIPTION =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus';

/**
 * All Movies Map
 */

const generateMovieTitle = () => {
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

const generateAltMovieTitle = () => {
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

const generateMoviePoster = () => {
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

const generateMovieDescription = (textArray) =>
  `${shuffle(textArray).slice(0, 5).join('. ')}.`;

const generateRating = () => getRandomFloat(0, 10, 1);

const generateComments = (comments) => {
  const getRandomIndex = getRandomInteger(1, 5);
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
  dayjs().toDate().getMinutes() + getRandomInteger(60, 120);

const generateDate = () => {
  const isDate = Boolean(getRandomInteger());

  if (!isDate) {
    return null;
  }
  return dayjs().add(getRandomInteger(-100, 0), 'year').toDate();
};

const generateCountry = () => {
  const titles = ['USA', 'Canada', 'Finland', 'Germany', 'Spain'];

  const getRandomIndex = getRandomInteger(0, titles.length - 1);
  return titles[getRandomIndex];
};

const generateAgeRating = () => {
  const titles = [0, 3, 6, 12, 18];

  const getRandomIndex = getRandomInteger(0, titles.length - 1);
  return titles[getRandomIndex];
};

const generateDirector = () => {
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

const generateScreenWriters = () => {
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

const generateActors = () => {
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

const generateGenres = () => {
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

const generateMovie = (allCommentsList) => {
  const dueDate = generateDate();
  const isWatchedStatus = dueDate !== null;

  return {
    // filmInfo: {
    //   title: generateMovieTitle(),
    //   alternativeTitle: generateAltMovieTitle(),
    //   totalRating: generateRating(),
    //   poster: generateMoviePoster(),
    //   ageRating: generateAgeRating(),
    //   director: generateDirector(),
    //   writers: generateScreenWriters(),
    //   actors: generateActors(),
    //   release: {
    //     date: generateDateRelease(),
    //     country: generateCountry(),
    //   },
    //   runTime: generateRuntime(),
    //   genres: generateGenres(),
    //   description: generateMovieDescription(textGenerator),
    // },
    // userDetails: {
    //   isWatchList: Boolean(getRandomInteger()),
    //   watchingDate: dueDate,
    //   isAlreadyWatched: isWatchedStatus,
    //   isFavorite: Boolean(getRandomInteger()),
    // },
    id: generateID(),
    comments: generateComments(allCommentsList),
    title: generateMovieTitle(),
    alternativeTitle: generateAltMovieTitle(),
    totalRating: generateRating(),
    poster: generateMoviePoster(),
    ageRating: generateAgeRating(),
    director: generateDirector(),
    writers: generateScreenWriters(),
    actors: generateActors(),
    date: generateDateRelease(),
    country: generateCountry(),

    runTime: generateRuntime(),
    genres: generateGenres(),
    description: generateMovieDescription(textGenerator),

    isWatchList: Boolean(getRandomInteger()),
    watchingDate: dueDate,
    isAlreadyWatched: isWatchedStatus,
    isFavorite: Boolean(getRandomInteger()),
  };
};

export const generateMovies = (allComments, moviesTotalCount) =>
  new Array(moviesTotalCount).fill().map(() => generateMovie(allComments));
