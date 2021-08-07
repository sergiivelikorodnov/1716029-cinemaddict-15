const movieToFilterMap = {
  watchedMovies: (movies) => movies.filter((movie) => movie.userDetails.watchList)
    .length,
  historyList: (movies) => movies.filter((movie) => movie.userDetails.alreadyWatched)
    .length,
  favoriteMovies: (movies) => movies.filter((movie) => movie.userDetails.favorite)
    .length,
};

const generateFilter = (movies) => Object.entries(movieToFilterMap).map(
  ([filterName, countMovies]) => ({
    name: filterName,
    count: countMovies(movies),
  }),
);
export { generateFilter };
