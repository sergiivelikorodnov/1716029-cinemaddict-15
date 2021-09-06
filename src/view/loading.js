import AbstractView from './abstract.js';

const createNoMovies = () => (
  '<h2 class="films-list__title">Loading...</h2>'
);


export default class Loading extends AbstractView {

  getTemplate() {
    return createNoMovies();
  }
}
