const movieToFilterMap = {
  watchedMovies: 'isWatchList',
  historyList: 'isAlreadyWatched',
  favoriteMovies: 'isFavorite',
};

const generateFilter = (movies) => Object.entries(movieToFilterMap).map(
  ([filterName, filterValue]) => ({
    name: filterName,
    count: movies.reduce((total, movie) => total + movie.userDetails[filterValue], 0),
  }),

);

export { generateFilter };
