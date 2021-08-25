import { SortType } from '../const.js';
import AbstractView from './abstract.js';

const createSiteSortTemplate = () => (
  `<ul class="sort">
  <li><a href="#" class="sort__button"  data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
  <li><a href="#" class="sort__button"  data-sort-type="${SortType.BY_DATE}">Sort by date</a></li>
  <li><a href="#" class="sort__button"  data-sort-type="${SortType.BY_RATING}">Sort by rating</a></li>
</ul>`
);


export default class SiteSortTemplate extends AbstractView {
  constructor() {
    super();
    this.getElement().querySelector('.sort__button').classList.add('sort__button--active');
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSiteSortTemplate();
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefault();
    this.getElement().querySelector('.sort__button--active').classList.remove('sort__button--active');
    this._callback.sortTypeChange(evt.target.dataset.sortType);
    evt.target.classList.add('sort__button--active');
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }

}
