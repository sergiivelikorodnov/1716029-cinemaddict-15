import { allMovies } from './mock/movie.js';

export const MOVIES_COUNT_PER_STEP = 10;
export const MAX_EXTRA_MOVIES = 2;
export const MAX_SHORT_DESCRIPTION_LENGTH = 139;


/**
 * Top Rated List Movies
 */
export const topMoviesList = allMovies
  .filter((movie) => movie.filmInfo.totalRating > 0)
  .sort((a, b) => a.filmInfo.totalRating < b.filmInfo.totalRating);

/**
 * Most Commented List Movies
 */
export const mostCommentedMoviesList = allMovies
  .filter((movie) => movie.comments.size > 0)
  .sort((a, b) => a.comments.size < b.comments.size);
