import { MAX_SHORT_DESCRIPTION_LENGTH } from '../const.js';
import AbstractView from './abstract.js';

const createFilmCard = (movie) => {
  const { title, poster, totalRating, release, runTime, genre, description } =
    movie.filmInfo;
  const shortDescripton = `${description.slice(0, MAX_SHORT_DESCRIPTION_LENGTH)}...`;
  const comments = movie.comments.size;
  const releaseDate = new Date(release.date).getFullYear();

  return `<article class="film-card">
  <h3 class="film-card__title">${title}</h3>
  <p class="film-card__rating">${totalRating}</p>
  <p class="film-card__info">
    <span class="film-card__year">${releaseDate}</span>
    <span class="film-card__duration">${runTime}</span>
    <span class="film-card__genre">${genre.join(', ')}</span>
  </p>
  <img src="${poster}" alt="" class="film-card__poster">
  <p class="film-card__description">${shortDescripton}</p>
  <a class="film-card__comments">${comments} comments</a>
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
  </div>
</article>`;
};

export default class FilmCard extends AbstractView{
  constructor(movie) {
    super();
    this._movie = movie;
    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCard(this._movie);
  }

  _clickHandler(evt) {
    if (evt.target.matches('.film-card__poster') || evt.target.matches('.film-card__title') || evt.target.matches('.film-card__comments')) {
      evt.preventDefault();
      this._callback.click();
    }
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().addEventListener('click', this._clickHandler);
  }
}
