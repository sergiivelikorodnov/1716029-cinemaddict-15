import AbstractView from './abstract.js';
import { FilterType } from '../const.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const { type, name, count } = filter;

  return `<a href="#${type}" class="main-navigation__item ${currentFilterType === type ? 'main-navigation__item--active' : ''}"
    data-filter-type="${type}"  data-menu="${type}" >${name} ${type !== FilterType.ALL ? `<span class="main-navigation__item-count">${count}</span>` : ''}</a>`;
};

const createSiteMenuFiltersTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return `<div class="main-navigation__items">
    ${filterItemsTemplate}
  </div>`;
};

export default class SiteMenuFiltersTemplate extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilterType = currentFilterType;
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuFiltersTemplate(
      this._filters,
      this._currentFilterType,
    );
  }

  _filterTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }

    document.querySelector('a[data-menu="statistics"]').classList.remove('main-navigation__item--active');

    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filterType);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('click', this._filterTypeChangeHandler);
  }
}
