import AbstractView from './abstract.js';

const createShowMoreButton = () => (
  `<button class="films-list__show-more">
  Show more
  </button>`
);

export default class ShowMoreButton extends AbstractView {
  constructor() {
    super();
    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createShowMoreButton();
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.showMoreMovies();
  }

  setClickHandler(callback) {
    this._callback.showMoreMovies = callback;
    this.getElement().addEventListener('click', this._clickHandler);
  }

}
