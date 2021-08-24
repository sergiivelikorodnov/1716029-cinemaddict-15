import { remove, render, replace } from '../utils/render.js';
import FilmCardView from '../view/film-card.js';
import FilmDetailsView from '../view/film-details.js';
//import FilmCommentView from '../view/film-comment.js';

export default class MoviePresenter {
  constructor(listMoviesContainer, changeData) {
    this._changeData = changeData;
    this._listMoviesComponent = listMoviesContainer.getElement().querySelector('.films-list__container');
    this._bodyElement = document.querySelector('body');
    this._onEscKeyDownHandle = this._onEscKeyDownHandle.bind(this);
    this._openPopupHandle = this._openPopupHandle.bind(this);
    this._closeButtonHandler = this._closeButtonHandler.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleAddToWatchlistClick = this._handleAddToWatchlistClick.bind(this);
    this._handleMarkAsWatchedClick = this._handleMarkAsWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._movieComponent = null;
    this._popupComponent = null;
  }

  init(movie) {
    this._movie = movie;
    const prevMovieComponent = this._movieComponent;
    const prevPopupComponent = this._popupComponent;
    this._movieComponent = new FilmCardView(movie);


    // comments.forEach((value) => console.log(value[0]));

    this._popupComponent = new FilmDetailsView(movie);
    this._movieComponent.setOpenFilmDetailsPopupHandler(this._openPopupHandle);
    this._popupComponent.setCloseFilmDetailsPopupHandler(this._closeButtonHandler);
    this._movieComponent.setAddToWatchlistHandler(this._handleAddToWatchlistClick);
    this._movieComponent.setMarkAsWatchedHandler(this._handleMarkAsWatchedClick);
    this._movieComponent.setAddFavoriteHandler(this._handleFavoriteClick);
    this._popupComponent.setAddToWatchlistHandler(this._handleAddToWatchlistClick);
    this._popupComponent.setMarkAsWatchedHandler(this._handleMarkAsWatchedClick);
    this._popupComponent.setAddFavoriteHandler(this._handleFavoriteClick);

    if (prevMovieComponent === null || prevPopupComponent === null) {
      render(this._listMoviesComponent, this._movieComponent);
      return;
    }

    replace(this._movieComponent, prevMovieComponent);
    replace(this._popupComponent, prevPopupComponent);

    remove(prevMovieComponent);
    remove(prevPopupComponent);
  }

  removeCardMovie() {
    remove(this._movieComponent);
    remove(this._popupComponent);
  }


  _renderPopup() {
    this._renderedMovieContainer = this._bodyElement.querySelector('.film-details');
    if (this._renderedMovieContainer !== null) {
      this._bodyElement.removeChild(this._renderedMovieContainer);
    }

    render(this._bodyElement, this._popupComponent);
    this._bodyElement.classList.add('.hide-overflow');
    document.addEventListener('keydown', this._onEscKeyDownHandle);
    this._popupComponent.setCloseFilmDetailsPopupHandler(this._closeButtonHandler);
  }

  _removePopup() {
    this._popupComponent.getElement().remove();
    this._bodyElement.classList.remove('.hide-overflow');
  }

  _openPopupHandle() {
    this._renderPopup();
  }

  _onEscKeyDownHandle (evt){
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._bodyElement.classList.remove('hide-overflow');
      this._popupComponent.getElement().remove();
      this._bodyElement.removeEventListener('keydown', this._onEscKeyDownHandle);
    }
  }

  _closeButtonHandler() {
    this._bodyElement.removeEventListener('keydown', this._onEscKeyDown);
    this._bodyElement.classList.remove('hide-overflow');
    this._popupComponent.getElement().remove();
  }

  _handleAddToWatchlistClick() {
    this._changeData(
      Object.assign(
        {},
        this._movie,
        this._movie.userDetails.isWatchList = !this._movie.userDetails.isWatchList,
      ),
    );
  }

  _handleMarkAsWatchedClick() {
    this._changeData(
      Object.assign(
        {},
        this._movie,
        this._movie.userDetails.isAlreadyWatched = !this._movie.userDetails.isAlreadyWatched,
      ),
    );
  }

  _handleFavoriteClick() {
    this._changeData(
      Object.assign(
        {},
        this._movie,
        this._movie.userDetails.isFavorite = !this._movie.userDetails.isFavorite,
      ),
    );
  }
}


