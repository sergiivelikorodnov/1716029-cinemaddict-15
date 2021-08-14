export const sortTopMoviesList = (allMovies) => allMovies.filter((movie) => movie.filmInfo.totalRating > 0).sort((a, b) => a.filmInfo.totalRating < b.filmInfo.totalRating);
export const sortMostCommentedMoviesList = (allMovies) => allMovies.filter((movie) => movie.comments.size > 0).sort((a, b) => a.comments.size < b.comments.size);
