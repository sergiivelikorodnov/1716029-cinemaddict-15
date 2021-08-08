import { createElement } from '../utils.js';

const createListMoviesLayout = (title1, title2) => (
  `<section class="films">
    <section class="films-list">
     <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
     <div class="films-list__container">

     </div>
    </section>
    <section class="films-list films-list--extra">
      <h2 class="films-list__title">${title1}</h2>
      <div class="films-list__container">

      </div>
    </section>
    <section class="films-list films-list--extra">
      <h2 class="films-list__title">${title2}</h2>
      <div class="films-list__container">

      </div>
    </section>
  </section>`
);

export default class HeaderProfile {
  constructor(title1, title2) {
    this._title1 = title1;
    this._title2 = title2;
    this._element = null;
  }

  getTemplate() {
    return createListMoviesLayout(this._title1, this._title2);
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
