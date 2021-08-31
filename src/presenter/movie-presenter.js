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
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._openPopupHandler = this._openPopupHandler.bind(this);
    this._removePopup = this._removePopup.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleAddToWatchlistClick = this._handleAddToWatchlistClick.bind(this);
    this._handleMarkAsWatchedClick = this._handleMarkAsWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handlePopupAddToWatchlistClick = this._handlePopupAddToWatchlistClick.bind(this);
    this._handlePopupMarkAsWatchedClick = this._handlePopupMarkAsWatchedClick.bind(this);
    this._handlePopupFavoriteClick = this._handlePopupFavoriteClick.bind(this);
    this._movieComponent = null;
    this._popupComponent = null;
    this._mode = Mode.CLOSED;
  }

  init(movie) {
    this._movie = movie;
    const prevMovieComponent = this._movieComponent;
    const prevPopupComponent = this._popupComponent;
    this._movieComponent = new FilmCardView(movie);


    this._movieComponent.setOpenFilmDetailsPopupHandler(this._openPopupHandler);
    this._movieComponent.setAddToWatchlistHandler(this._handleAddToWatchlistClick);
    this._movieComponent.setMarkAsWatchedHandler(this._handleMarkAsWatchedClick);
    this._movieComponent.setAddFavoriteHandler(this._handleFavoriteClick);

    if (prevMovieComponent === null || prevPopupComponent === null) {
      render(this._listMoviesComponent, this._movieComponent);
      return;
    }


    //if (this._listMoviesComponent.contains(prevMovieComponent.getElement())) {

    replace(this._movieComponent, prevMovieComponent);
    // this._movieComponent.setOpenFilmDetailsPopupHandler(this._openPopupHandler);
    // }

    if (prevPopupComponent) {
      replace(this._popupComponent, prevPopupComponent);
    }

    if (this._mode === Mode.OPENED) {
      this._rerenderPopup(this._movie);
    }

    remove(prevMovieComponent);
    //remove(prevPopupComponent);
  }

  removeCardMovie() {
    remove(this._movieComponent);
  }

  resetView() {
    if (this._mode !== Mode.CLOSED) {
      this._removePopup();
    }
  }

  _rerenderPopup(movie) {
    this._changeMode();
    this._mode = Mode.OPENED;

    this._popupComponent = new FilmDetailsView(movie);
    this._popupComponent.setCloseFilmDetailsPopupHandler(this._removePopup);
    this._popupComponent.setAddToWatchlistHandler(this._handlePopupAddToWatchlistClick);
    this._popupComponent.setMarkAsWatchedHandler(this._handlePopupMarkAsWatchedClick);
    this._popupComponent.setAddFavoriteHandler(this._handlePopupFavoriteClick);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._renderedMovieContainer = this._bodyElement.querySelector('.film-details');
    if (this._renderedMovieContainer !== null) {
      this._bodyElement.removeChild(this._renderedMovieContainer);
    }

    render(this._bodyElement, this._popupComponent);
    this._bodyElement.classList.add('hide-overflow');
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  _openPopupHandler() {
    this._changeMode();
    this._mode = Mode.OPENED;

    this._popupComponent = new FilmDetailsView(this._movie);
    this._popupComponent.setCloseFilmDetailsPopupHandler(this._removePopup);
    this._popupComponent.setAddToWatchlistHandler(this._handlePopupAddToWatchlistClick);
    this._popupComponent.setMarkAsWatchedHandler(this._handlePopupMarkAsWatchedClick);
    this._popupComponent.setAddFavoriteHandler(this._handlePopupFavoriteClick);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._renderedMovieContainer = this._bodyElement.querySelector('.film-details');
    if (this._renderedMovieContainer !== null) {
      this._bodyElement.removeChild(this._renderedMovieContainer);
    }

    render(this._bodyElement, this._popupComponent);
    this._bodyElement.classList.add('hide-overflow');
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  _handleModelEvent() {
    const prevPopupScrollHeight = this._popupComponent.getElement().scrollHeight;

    this._removePopup();
    this._openPopupHandler();

    this._popupComponent.getElement().scrollTop = prevPopupScrollHeight;
  }

  _removePopup() {
    remove(this._popupComponent);
    this._bodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.CLOSED;
  }

  _escKeyDownHandler (evt){
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._bodyElement.classList.remove('hide-overflow');
      //this._popupComponent.reset(this._movie);
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
      UserAction.UPDATE_MOVIE,
      this._mode === Mode.CLOSED ? UpdateType.MINOR : UpdateType.PATCH,

      Object.assign(
        {},
        this._movie,
        {
          isWatchList: !this._movie.isWatchList,
        },
      ),
    );
  }

  _handleMarkAsWatchedClick() {
    this._changeData(
      UserAction.UPDATE_MOVIE,
      this._mode === Mode.CLOSED ? UpdateType.MINOR : UpdateType.PATCH,
      Object.assign(
        {},
        this._movie,
        {
          isAlreadyWatched : !this._movie.isAlreadyWatched,
        },
      ),
    );
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_MOVIE,
      this._mode === Mode.CLOSED ? UpdateType.MINOR : UpdateType.PATCH,
      Object.assign(
        {},
        this._movie,
        this._movie.isFavorite = !this._movie.isFavorite,
      ),
    );
  }

  _handlePopupAddToWatchlistClick() {
    this._changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._movie,
        this._movie.isWatchList = !this._movie.isWatchList,
      ),
    );
  }

  _handlePopupMarkAsWatchedClick() {
    this._changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._movie,
        this._movie.isAlreadyWatched = !this._movie.isAlreadyWatched,
      ),
    );
  }

  _handlePopupFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._movie,
        this._movie.isFavorite = !this._movie.isFavorite,
      ),
    );
  }
}


