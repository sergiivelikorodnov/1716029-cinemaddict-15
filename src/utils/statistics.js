import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isBetween from 'dayjs/plugin/isBetween';
import { StatsFilterType, UserRang } from '../const.js';

dayjs.extend(isToday);
dayjs.extend(isBetween);

const movieToFilterMap = {
  runTime: 'isAlreadyWatched',
};

const now = dayjs();
const week = dayjs().subtract(1, 'week');
const month = dayjs().subtract(1, 'month');
const year = dayjs().subtract(1, 'year');

const filteredMovies = {
  [StatsFilterType.ALL]: (movies) => movies.filter((movie) => movie.isAlreadyWatched),
  [StatsFilterType.TODAY]: (movies) => movies.filter((movie) => movie.isAlreadyWatched && dayjs(movie.watchedDate).isToday()),
  [StatsFilterType.WEEK]: (movies) => movies.filter((movie) => movie.isAlreadyWatched && dayjs(movie.watchedDate).isBetween(now, week)),
  [StatsFilterType.MONTH]: (movies) => movies.filter((movie) => movie.isAlreadyWatched && dayjs(movie.watchedDate).isBetween(now, month)),
  [StatsFilterType.YEAR]: (movies) => movies.filter((movie) => movie.isAlreadyWatched && dayjs(movie.watchedDate).isBetween(now , year)),
};

export const watchedMoviesByDateRange = (movies, currentFilmType) => {
  let filteredStatsMovies = [];
  switch (currentFilmType) {
    case StatsFilterType.ALL:
      filteredStatsMovies = filteredMovies[StatsFilterType.ALL](movies);
      break;
    case StatsFilterType.TODAY:
      filteredStatsMovies = filteredMovies[StatsFilterType.TODAY](movies);
      break;
    case StatsFilterType.WEEK:
      filteredStatsMovies = filteredMovies[StatsFilterType.WEEK](movies);
      break;
    case StatsFilterType.MONTH:
      filteredStatsMovies = filteredMovies[StatsFilterType.MONTH](movies);
      break;
    case StatsFilterType.YEAR:
      filteredStatsMovies = filteredMovies[StatsFilterType.YEAR](movies);
      break;
  }
  return filteredStatsMovies;
};

export const calcPopularGenres = (movies) => {
  const allGenres = [];
  movies
    .forEach(((movie) => movie.genres.forEach((genre) => allGenres.push(genre))));
  const  countGenres = {};
  allGenres.forEach((i) => { countGenres[i] = (countGenres[i] || 0) + 1; });
  return Object.fromEntries(Object.entries(countGenres).sort((a, b) => b[1] - a[1]));

};

export const getWatchedMoviesCount = (movies) => movies.reduce((total, movie) => total + movie.isAlreadyWatched, 0);

export const generateStatsData = (films) => Object.entries(movieToFilterMap).map(
  ([filterName, filterValue]) => ({
    runTime: films.filter((movie) => movie[filterValue] === true).reduce((total, movie) => total + movie[filterName], 0),
    watched: films.reduce((total, movie) => total + movie[filterValue], 0),
  }),
);

export const userRang = (moviesCount) => {
  if (moviesCount === UserRang.NEWBEE.WATCHED_MOVIES) {
    return UserRang.NEWBEE.RANG;
  }
  if (moviesCount < UserRang.NOVICE.WATCHED_MOVIES) {
    return UserRang.NOVICE.RANG;
  }
  if (moviesCount < UserRang.FAN.WATCHED_MOVIES) {
    return UserRang.FAN.RANG;
  } else {
    return UserRang.MOVIE_BUFF.RANG;
  }
};

