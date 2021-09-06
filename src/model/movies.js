import AbstractObserver from '../utils/abstract-observer';

export default class Movies extends AbstractObserver {
  constructor() {
    super();
    this._allMovies = [];
  }

  setMovies(updateType, movies) {
    this._allMovies = movies.slice();
    this._notify(updateType);
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

  static adaptToClient(movie) {
    const adaptedMovie = Object.assign(
      {},
      movie,
      {
        'comments': new Set (movie.comments),
        'title': movie.film_info.title,
        'alternativeTitle': movie.film_info.alternative_title,
        'totalRating': movie.film_info.total_rating,
        'poster': movie.film_info.poster,
        'ageRating': movie.film_info.age_rating,
        'director': movie.film_info.director,
        'writers': movie.film_info.writers,
        'actors': movie.film_info.actors,
        'date': movie.film_info.release.date,
        'country': movie.film_info.release.release_country,

        'runTime': movie.film_info.runtime,
        'genres': movie.film_info.genre,
        'description': movie.film_info.description,

        'isWatchList': movie.user_details.watchlist,
        'watchingDate': movie.user_details.watching_date,
        'isAlreadyWatched': movie.user_details.already_watched,
        'isFavorite': movie.user_details.favorite,
      },
    );

    delete adaptedMovie.film_info;
    delete adaptedMovie.user_details;

    return adaptedMovie;
  }

  static adaptToServer(movie) {
    const adaptedMovie = Object.assign(
      {},
      movie,
      {
        'film_info': {
          'comments': Array.from (movie.comments),
          'title': movie.title,
          'alternative_title': movie.alternativeTitle,
          'total_rating': movie.totalRating,
          'poster': movie.poster,
          'age_rating': movie.ageRating,
          'director': movie.director,
          'writers': movie.writers,
          'actors': movie.actors,
          'runtime': movie.runTime,
          'genre': movie.genres,
          'description': movie.description,
          'release': {
            'date': movie.date,
            'release_country':movie.country,
          },
        },

        'user_details': {
          'watchlist': movie.isWatchList,
          'watching_date': movie.watchingDate,
          'already_watched': movie.isAlreadyWatched,
          'favorite': movie.isFavorite,
        },
      },
    );

    delete adaptedMovie.title;
    delete adaptedMovie.alternativeTitle;
    delete adaptedMovie.totalRating;
    delete adaptedMovie.poster;
    delete adaptedMovie.ageRating;
    delete adaptedMovie.director;
    delete adaptedMovie.writers;
    delete adaptedMovie.actors;
    delete adaptedMovie.date;
    delete adaptedMovie.country;

    delete adaptedMovie.runTime;
    delete adaptedMovie.genres;
    delete adaptedMovie.description;

    delete adaptedMovie.isWatchList;
    delete adaptedMovie.watchingDate;
    delete adaptedMovie.isAlreadyWatched;
    delete adaptedMovie.isFavorite;

    return adaptedMovie;
  }

}

