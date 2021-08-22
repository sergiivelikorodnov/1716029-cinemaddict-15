import { MAX_SHORT_DESCRIPTION_LENGTH } from '../const.js';
import { timeConvertor } from '../utils/common.js';

import AbstractView from './abstract.js';

const createFilmCard = (movie) => {
  const { title, poster, totalRating, release, runTime, genres, description } =
    movie.filmInfo;
  const {
    alreadyWatched,
    favorite,
    watchList,
  } = movie.userDetails;

  const alreadyWatchedActive = alreadyWatched ? 'film-card__controls-item--active' : '';
  const favoritedActive = favorite ? 'film-card__controls-item--active' : '';
  const watchListActive = watchList ? 'film-card__controls-item--active' : '';

  const shortDescripton = `${description.slice(0, MAX_SHORT_DESCRIPTION_LENGTH)}...`;
  const comments = movie.comments.size;
  const releaseDate = new Date(release.date).getFullYear();
  const humanRunTime = timeConvertor(runTime);

  return `<article class="film-card">
  <h3 class="film-card__title">${title}</h3>
  <p class="film-card__rating">${totalRating}</p>
  <p class="film-card__info">
    <span class="film-card__year">${releaseDate}</span>
    <span class="film-card__duration">${humanRunTime}</span>
    <span class="film-card__genre">${genres.join(', ')}</span>
  </p>
  <img src="${poster}" alt="" class="film-card__poster">
  <p class="film-card__description">${shortDescripton}</p>
  <a class="film-card__comments">${comments} comments</a>
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${watchListActive}" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${alreadyWatchedActive}" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite ${favoritedActive}" type="button">Mark as favorite</button>
  </div>
</article>`;
};

export default class FilmCard extends AbstractView{
  constructor(movie, changeData) {
    super();
    this._movie = movie;
    this._openFilmDetailsPopupHandler = this._openFilmDetailsPopupHandler.bind(this);
    this._addToWatchlistHandler = this._addToWatchlistHandler.bind(this);
    this._markAsWatchedHandler = this._markAsWatchedHandler.bind(this);
    this._addFavoriteHandler = this._addFavoriteHandler.bind(this);
    this._changeData = changeData;
  }

  getTemplate() {
    return createFilmCard(this._movie);
  }

  _openFilmDetailsPopupHandler(evt) {
    if (evt.target.matches('.film-card__poster') || evt.target.matches('.film-card__title') || evt.target.matches('.film-card__comments')) {
      evt.preventDefault();
      this._callback.openFilmDetailsPopup();
    }
  }

  _addToWatchlistHandler(evt) {
    evt.preventDefault();
    this._callback.addToWatchlistClick();
  }

  _markAsWatchedHandler(evt) {
    evt.preventDefault();
    this._callback.markAsWatchedHandler();
  }

  _addFavoriteHandler(evt) {
    evt.preventDefault();
    this._callback.addFavoriteHandler();
  }

  setOpenFilmDetailsPopupHandler(callback) {
    this._callback.openFilmDetailsPopup = callback;
    this.getElement().addEventListener('click', this._openFilmDetailsPopupHandler);
  }

  setAddToWatchlistHandler(callback) {
    this._callback.addToWatchlistClick = callback;
    this.getElement().querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this._addToWatchlistHandler);
  }

  setMarkAsWatchedHandler(callback) {
    this._callback.markAsWatchedHandler = callback;
    this.getElement().querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this._markAsWatchedHandler);
  }

  setAddFavoriteHandler(callback) {
    this._callback.addFavoriteHandler = callback;
    this.getElement().querySelector('.film-card__controls-item--favorite').addEventListener('click', this._addFavoriteHandler);
  }
}
