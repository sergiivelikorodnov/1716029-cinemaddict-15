import AbstractView from './abstract.js';

const createShowMoreButton = () => (
  `<button class="films-list__show-more">
  Show more
  </button>`
);

export default class ShowMoreButton extends AbstractView {
  constructor() {
    super();
    this._showMoreMoviesHandler = this._showMoreMoviesHandler.bind(this);
  }

  getTemplate() {
    return createShowMoreButton();
  }

  _showMoreMoviesHandler(evt) {
    evt.preventDefault();
    this._callback.showMoreMovies();
  }

  setShowMoreMoviesHandler(callback) {
    this._callback.showMoreMovies = callback;
    this.getElement().addEventListener('click', this._showMoreMoviesHandler);
  }

}
