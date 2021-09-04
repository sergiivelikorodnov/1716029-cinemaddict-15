import AbstractView from './abstract.js';
import { MenuItem } from '../const.js';

const createSiteMenuTemplate = () => `<nav class="main-navigation">
  <a href="#${MenuItem.STATISTICS}" class="main-navigation__additional" data-menu="${MenuItem.STATISTICS}">Stats</a>
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

    const currentMenu = evt.target;
    if (evt.target.getAttribute('href') === `#${MenuItem.STATISTICS}`) {
      this.getElement().querySelectorAll('.main-navigation__item').forEach((menuItem) => menuItem.classList.remove('main-navigation__item--active'));
      currentMenu.classList.add('main-navigation__item--active');
    }

    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.menu);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }
}
