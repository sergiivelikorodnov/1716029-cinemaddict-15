const movieToFilterMap = {
  watchedMovies: (movies) => movies.filter((movie) => movie.userDetails.isWatchList)
    .length,
  historyList: (movies) => movies.filter((movie) => movie.userDetails.isAlreadyWatched)
    .length,
  favoriteMovies: (movies) => movies.filter((movie) => movie.userDetails.isFavorite)
    .length,
};

const generateFilter = (movies) => /* Object.entries(movieToFilterMap).map(
  ([filterName, countMovies]) => ({
    name: filterName,
    count: countMovies(movies),
  }), */
  console.log((movies) => movies.filter((movie) => movie.userDetails.isWatchList)
    .length),
//);


export { generateFilter };
