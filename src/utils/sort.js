import dayjs from 'dayjs';

export const sortTopMoviesList = (allMovies) => allMovies.filter((movie) => movie.totalRating > 0).sort((a, b) => a.totalRating < b.totalRating);
export const sortMostCommentedMoviesList = (allMovies) => allMovies.filter((movie) => movie.comments.size > 0).sort((a, b) => a.comments.size < b.comments.size);

export const sortMoviesByDate = (MovieA, MovieB) => {
  if (MovieB.dueDate === null) {
    return;
  }

  return dayjs(MovieB.date).diff(dayjs(MovieA.date));
};

export const sortMoviesByRating = (MovieA, MovieB) => MovieB.totalRating - MovieA.totalRating;
