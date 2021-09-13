import dayjs from 'dayjs';
import { MAX_EXTRA_MOVIES } from '../const';

export const sortTopMoviesList = (allMovies) =>
  allMovies
    .filter((movie) => movie.totalRating > 0)
    .sort((a, b) => a.totalRating < b.totalRating)
    .slice(0, MAX_EXTRA_MOVIES);

export const sortMostCommentedMoviesList = (allMovies) => (allMovies
  .filter((movie) => movie.comments.length > 0)
  .sort((a, b) => b.comments.length - a.comments.length)
  .slice(0, MAX_EXTRA_MOVIES));

export const sortMoviesByDate = (MovieA, MovieB) => {
  if (MovieB.dueDate === null) {
    return;
  }

  return dayjs(MovieB.date).diff(dayjs(MovieA.date));
};

export const sortMoviesByRating = (MovieA, MovieB) =>
  MovieB.totalRating - MovieA.totalRating;
