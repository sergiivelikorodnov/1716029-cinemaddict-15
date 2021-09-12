import MoviesModel from '../model/movies.js';
import {isOnline} from '../utils/common.js';

const createStoreStructure = (items) => {

  items
    .reduce((acc, current) => Object.assign({}, acc, {
      [current.id]: current,
    }), {});
  return items;
};


export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getMovies() {
    if (isOnline()) {
      return this._api.getMovies()
        .then((movies) => {
          const items = createStoreStructure(movies.map(MoviesModel.adaptToServer));
          this._store.setItems(items);
          this._store.getItems();
          return movies;
        });
    }


    const storeMovies = Object.values(this._store.getItems());
    return Promise.resolve(storeMovies.map(MoviesModel.adaptToClient));
  }

  getComments(movieId) {
    if (isOnline()) {
      return this._api.getComments(movieId)
        .then((comments) => comments);
    }

    return Promise.reject(new Error('You can\'t get comments offline'));
  }

  updateMovie(movie) {
    if (isOnline()) {
      return this._api.updateMovie(movie)
        .then((updatedMovie) => {
          this._store.setItem(updatedMovie.id, MoviesModel.adaptToServer(updatedMovie));
          return updatedMovie;
        });
    }


    this._store.setItem(movie.id, MoviesModel.adaptToServer(Object.assign({}, movie)));
    return Promise.resolve(movie);
  }

  addComment(movie, comment) {
    if (isOnline()) {
      return this._api.addComment(movie, comment)
        .then((newComment) => newComment);
    }

    return Promise.reject(new Error('Add comment failed'));
  }

  deleteComment(commentId) {
    if (isOnline()) {
      return this._api.deleteComment(commentId);
    }

    return Promise.reject(new Error('Delete comment failed'));
  }

  sync() {
    if (isOnline()) {
      const storeMovies = Object.values(this._store.getItems());
      return this._api.sync(storeMovies)
        .then((response) => {

          const updatedMovies = response.updated;

          const items = createStoreStructure(updatedMovies);
          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error('Sync data failed'));
  }
}
