export const calcPopularGenres = (movies) => {
  const allGenres = [];
  movies.forEach(((movie) => movie.genres.forEach((genre) => allGenres.push(genre))));
  const  countGenres = {};
  allGenres.forEach((i) => { countGenres[i] = (countGenres[i] || 0) + 1; });
  return Object.fromEntries(Object.entries(countGenres).sort((a, b) => b[1] - a[1]));
};
