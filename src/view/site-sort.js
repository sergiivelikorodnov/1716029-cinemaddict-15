import { SortType } from '../const.js';
import AbstractView from './abstract.js';

const createSiteSortTemplate = (currentSortType) =>
  `<ul class="sort">
  <li><a href="#" class="sort__button ${
  currentSortType === SortType.DEFAULT ? 'sort__button--active' : ''
}"  data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
  <li><a href="#" class="sort__button ${
  currentSortType === SortType.BY_DATE ? 'sort__button--active' : ''
}"  data-sort-type="${SortType.BY_DATE}">Sort by date</a></li>
  <li><a href="#" class="sort__button ${
  currentSortType === SortType.BY_RATING ? 'sort__button--active' : ''
}"  data-sort-type="${SortType.BY_RATING}">Sort by rating</a></li>
</ul>`;

export default class SiteSort extends AbstractView {
  constructor(currentSortType) {
    super();
    this._currentSortType = currentSortType;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSiteSortTemplate(this._currentSortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }
}
