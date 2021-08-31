import AbstractView from './abstract.js';
import { FilterType } from '../const.js';

const NoMoviesTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

const createNoMovies = (filterType) => {
  const noMoviesText = NoMoviesTextType[filterType];
  return (
    `<h2 class="films-list__title">
    ${noMoviesText}
  </h2>`);
};

export default class NoMovies extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    return createNoMovies(this._data);
  }
}
