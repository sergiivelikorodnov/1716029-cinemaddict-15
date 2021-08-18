

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomFloat = (min, max, exp) =>
  (Math.random() * (max - min) + min).toFixed(exp);

export const shuffle = (arr) =>
  arr
    .map((i) => [Math.random(), i])
    .sort()
    .map((i) => i[1]);

export const updateMovie = (allMovies, updatedMovie) => {
  const index = allMovies.findIndex((movie) => movie.id === updatedMovie.id);
  if (index === -1) {
    return allMovies;
  }

  return [
    ...allMovies.slice(0, index),
    updatedMovie,
    ...allMovies.slice(index + 1),
  ];
};
