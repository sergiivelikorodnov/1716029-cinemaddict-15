import AbstractView from './abstract.js';
import { MenuItem } from '../const.js';

const createSiteMenuTemplate = () => `<nav class="main-navigation">
  <a href="#stats" class="main-navigation__additional" data-menu="${MenuItem.STATISTICS}">Stats</a>
</nav>`;

export default class SiteMenuFiltersTemplate extends AbstractView {
  constructor() {
    super();
    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate();
  }

  _menuClickHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.menu);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }
}
