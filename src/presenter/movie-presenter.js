import { UpdateType, UserAction } from '../const.js';
import { remove, render, replace } from '../utils/render.js';
import FilmCardView from '../view/film-card.js';
import FilmDetailsView from '../view/film-details.js';
const Mode = {
  CLOSED: 'CLOSED',
  OPENED: 'OPENED',
};
export default class MoviePresenter {
  constructor(listMoviesContainer, changeData, changeMode) {
    this._changeMode = changeMode;
    this._changeData = changeData;
    this._listMoviesComponent = listMoviesContainer.getElement().querySelector('.films-list__container');
    this._bodyElement = document.querySelector('body');
    this._onEscKeyDownHandle = this._onEscKeyDownHandle.bind(this);
    this._openPopupHandle = this._openPopupHandle.bind(this);
    this._removePopup = this._removePopup.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleAddToWatchlistClick = this._handleAddToWatchlistClick.bind(this);
    this._handleMarkAsWatchedClick = this._handleMarkAsWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._movieComponent = null;
    this._popupComponent = null;
    this._mode = Mode.CLOSED;
  }

  init(movie) {
    this._movie = movie;
    const prevMovieComponent = this._movieComponent;
    const prevPopupComponent = this._popupComponent;
    this._movieComponent = new FilmCardView(movie);

    this._movieComponent.setOpenFilmDetailsPopupHandler(this._openPopupHandle);
    this._movieComponent.setAddToWatchlistHandler(this._handleAddToWatchlistClick);
    this._movieComponent.setMarkAsWatchedHandler(this._handleMarkAsWatchedClick);
    this._movieComponent.setAddFavoriteHandler(this._handleFavoriteClick);

    if (prevMovieComponent === null) {
      render(this._listMoviesComponent, this._movieComponent);
      return;
    }

    replace(this._movieComponent, prevMovieComponent);

    if (this._mode === Mode.OPENED) {
      replace(this._popupComponent, prevPopupComponent);
    }

    remove(prevMovieComponent);
  }

  removeCardMovie() {
    remove(this._movieComponent);
  }

  resetView() {
    if (this._mode !== Mode.CLOSED) {
      this._removePopup();
    }
  }

  _renderPopup() {
    this._popupComponent = new FilmDetailsView(this._movie);
    this._popupComponent.setCloseFilmDetailsPopupHandler(this._removePopup);
    this._popupComponent.setAddToWatchlistHandler(this._handleAddToWatchlistClick);
    this._popupComponent.setMarkAsWatchedHandler(this._handleMarkAsWatchedClick);
    this._popupComponent.setAddFavoriteHandler(this._handleFavoriteClick);

    this._changeMode();
    this._mode = Mode.OPENED;

    this._renderedMovieContainer = this._bodyElement.querySelector('.film-details');
    if (this._renderedMovieContainer !== null) {
      this._bodyElement.removeChild(this._renderedMovieContainer);
    }

    render(this._bodyElement, this._popupComponent);
    this._bodyElement.classList.add('.hide-overflow');
    document.addEventListener('keydown', this._onEscKeyDownHandle);
  }

  _removePopup() {
    remove(this._popupComponent);
    this._bodyElement.classList.remove('.hide-overflow');
    document.removeEventListener('keydown', this._onEscKeyDownHandle);
    this._mode = Mode.CLOSED;
  }

  _openPopupHandle() {
    this._renderPopup();
  }

  _onEscKeyDownHandle (evt){
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._bodyElement.classList.remove('hide-overflow');
      this._removePopup();
    }
  }

  _closeButtonHandler() {
    this._bodyElement.removeEventListener('keydown', this._onEscKeyDown);
    this._bodyElement.classList.remove('hide-overflow');
    this._popupComponent.getElement().remove();
  }

  _handleAddToWatchlistClick() {
    this._changeData(
      UserAction.UPDATE_TASK,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._movie,
        this._movie.userDetails.isWatchList = !this._movie.userDetails.isWatchList,
      ),
    );
  }

  _handleMarkAsWatchedClick() {
    this._changeData(
      UserAction.UPDATE_TASK,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._movie,
        this._movie.userDetails.isAlreadyWatched = !this._movie.userDetails.isAlreadyWatched,
      ),
    );
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_TASK,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._movie,
        this._movie.userDetails.isFavorite = !this._movie.userDetails.isFavorite,
      ),
    );
  }
}


