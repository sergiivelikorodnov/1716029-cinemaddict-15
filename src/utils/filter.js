import { FilterType } from '../const.js';
// import { sortMoviesByDate, sortMoviesByRating } from './sort.js';

export const filter = {
  [FilterType.ALL]: (movies) => movies,
  [FilterType.WATCHLIST]: (movies) => movies.filter((movie) => movie.isWatchList),
  [FilterType.HISTORY]: (movies) => movies.filter((movie) => movie.isAlreadyWatched),
  [FilterType.FAVORITES]: (movies) => movies.filter((movie) => movie.isFavorite),
};
