import AbstractView from './abstract.js';

const createFooterStatistics = (allMovies) =>
  `<section class="footer__statistics">
  <p>${allMovies} movies inside</p>
</section>`;

export default class FooterStatistics extends AbstractView {
  constructor(allMovies) {
    super();
    this._allMovies = allMovies;
  }

  getTemplate() {
    return createFooterStatistics(this._allMovies);
  }
}
