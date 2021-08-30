import AbstractObserver from '../utils/abstract-observer';

export default class Movies extends AbstractObserver{
  constructor() {
    super();
    this._allMovies = [];
  }

  setMovies(movies) {
    this._allMovies = movies.slice();
  }

  getMovies() {
    return this._allMovies;
  }

  updateMovie(updateType, update) {
    const index = this._allMovies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting movie');
    }
    this._allMovies = [
      ...this._allMovies.slice(0, index),
      update,
      ...this._allMovies.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

}
