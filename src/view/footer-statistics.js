import { createElement } from '../utils.js';

const createFooterStatistics = (allMovies) =>
  `<section class="footer__statistics">
  <p>${allMovies} movies inside</p>
</section>`;

export default class FooterStatistics {
  constructor(allMovies) {
    this._allMovies = allMovies;
    this._element = null;
  }

  getTemplate() {
    return createFooterStatistics(this._allMovies);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
