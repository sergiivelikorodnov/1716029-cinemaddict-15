import { removeComponent, render } from '../utils/render.js';
import FilmCardView from '../view/film-card.js';

export default class MoviePresenter {
  constructor(listMoviesContainer, changeData) {
    this._listMoviesComponent = listMoviesContainer;
    this._changeData = changeData;
    // this._addToWatchlistHandler = this._addToWatchlistHandler.bind(this);
  }

  init(movie) {
    this._movie = movie;
    this._movieComponent = new FilmCardView(movie);
    render(this._listMoviesComponent, this._movieComponent);
  }

  destroy() {
    removeComponent(this._movieComponent);
  }

  _onEscKeyDown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._bodyContainer.classList.remove('hide-overflow');
      removeComponent(this._openedMovieDetailsComponent);
      this._bodyContainer.removeEventListener('keydown', this._onEscKeyDown);
    }
  }

  _closeButtonHandler() {
    document.removeEventListener('keydown', this._onEscKeyDown);
    this._bodyContainer.classList.remove('hide-overflow');
    removeComponent(this._openedMovieDetailsComponent);
  }

  // _addToWatchlistHandler() {
  //   this._changeData(
  //     Object.assign(
  //       {},
  //       this._movie,
  //       this._movie.userDetails.watchList = !this._movie.userDetails.watchList,
  //     ),
  //   );
  // }
}


