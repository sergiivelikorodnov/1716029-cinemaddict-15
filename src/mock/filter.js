const generateFilters = (allMovies) => ({
  watchedMovies: allMovies.filter((movie) => movie.userDetails.watchList)
    .length,
  historyList: allMovies.filter((movie) => movie.userDetails.alreadyWatched)
    .length,
  favoriteMovies: allMovies.filter((movie) => movie.userDetails.favorite)
    .length,
});

export { generateFilters };
