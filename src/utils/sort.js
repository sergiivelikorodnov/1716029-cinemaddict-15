import dayjs from 'dayjs';

export const sortTopMoviesList = (allMovies) => allMovies.filter((movie) => movie.filmInfo.totalRating > 0).sort((a, b) => a.filmInfo.totalRating < b.filmInfo.totalRating);
export const sortMostCommentedMoviesList = (allMovies) => allMovies.filter((movie) => movie.comments.size > 0).sort((a, b) => a.comments.size < b.comments.size);
export const filterComments = (someComments, commentId, commentValue) => someComments.filter((comment) => comment[commentId] === commentValue);

export const sortMoviesByDate = (MovieA, MovieB) => {
  if (MovieB.dueDate === null) {
    return;
  }

  return dayjs(MovieB.filmInfo.release.date).diff(dayjs(MovieA.filmInfo.release.date));
};

export const sortMoviesByRating = (MovieA, MovieB) => MovieB.filmInfo.totalRating - MovieA.filmInfo.totalRating;
