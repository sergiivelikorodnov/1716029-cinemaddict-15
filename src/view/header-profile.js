import { userRang } from '../utils/statistics.js';
import AbstractView from './abstract.js';

const createHeaderProfile = (moviesCount) => (
  `<section class="header__profile profile">
  <p class="profile__rating">${userRang(moviesCount)}</p>
  <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
</section>`);

export default class HeaderProfile extends AbstractView {
  constructor(watchedMoviesCount) {
    super();
    this._watchedMoviesCount = watchedMoviesCount;
  }

  getTemplate() {
    return createHeaderProfile(this._watchedMoviesCount);
  }
}
