import dayjs from 'dayjs';

export const sortTopMoviesList = (allMovies) =>
  allMovies
    .filter((movie) => movie.totalRating > 0)
    .sort((a, b) => a.totalRating < b.totalRating)
    .slice(0, 2);

export const sortMostCommentedMoviesList = (allMovies) =>
  allMovies
    .filter((movie) => movie.comments.length > 0)
    .sort((a, b) => a.comments.length < b.comments.length)
    .slice(0, 2);

export const sortMoviesByDate = (MovieA, MovieB) => {
  if (MovieB.dueDate === null) {
    return;
  }

  return dayjs(MovieB.date).diff(dayjs(MovieA.date));
};

export const sortMoviesByRating = (MovieA, MovieB) =>
  MovieB.totalRating - MovieA.totalRating;
