import AbstractView from './abstract.js';

const createListMoviesContainer = () => (
  `<section class="films">
  </section>`
);

export default class MoviesContainer extends AbstractView {
  getTemplate() {
    return createListMoviesContainer();
  }
}
