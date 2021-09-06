import dayjs from 'dayjs';
import { UpdateType, UserAction } from '../const.js';
import { removeObjectFromSet } from '../utils/common.js';
import { remove, render, replace } from '../utils/render.js';
import FilmCardView from '../view/film-card.js';
import FilmDetailsView from '../view/film-details.js';
const Mode = {
  CLOSED: 'CLOSED',
  OPENED: 'OPENED',
};
export default class MoviePresenter {
  constructor(listMoviesContainer, changeData, changeMode, commentsModel) {
    this._changeMode = changeMode;
    this._changeData = changeData;
    this._commentsModel = commentsModel;
    this._listMoviesComponent = listMoviesContainer
      .getElement()
      .querySelector('.films-list__container');
    this._bodyElement = document.querySelector('body');
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._openPopupHandler = this._openPopupHandler.bind(this);
    this._removePopup = this._removePopup.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleAddToWatchlistClick =
    this._handleAddToWatchlistClick.bind(this);
    this._handleMarkAsWatchedClick = this._handleMarkAsWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handlePopupAddToWatchlistClick =
    this._handlePopupAddToWatchlistClick.bind(this);
    this._handlePopupMarkAsWatchedClick =
    this._handlePopupMarkAsWatchedClick.bind(this);
    this._handlePopupFavoriteClick = this._handlePopupFavoriteClick.bind(this);
    this._handleDeleteCommentClick = this._handleDeleteCommentClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
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
    this._movieComponent.setAddToWatchlistHandler(
      this._handleAddToWatchlistClick,
    );
    this._movieComponent.setMarkAsWatchedHandler(
      this._handleMarkAsWatchedClick,
    );
    this._movieComponent.setAddFavoriteHandler(this._handleFavoriteClick);

    if (prevMovieComponent === null || prevPopupComponent === null) {
      render(this._listMoviesComponent, this._movieComponent);
      return;
    }

    replace(this._movieComponent, prevMovieComponent);

    if (prevPopupComponent) {
      replace(this._popupComponent, prevPopupComponent);
    }

    if (this._mode === Mode.OPENED) {
      this._rerenderPopup(this._movie);
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

  _rerenderPopup(movie) {
    this._changeMode();
    this._mode = Mode.OPENED;

    this._popupComponent = new FilmDetailsView(movie, this._commentsModel);
    this._popupComponent.setCloseFilmDetailsPopupHandler(this._removePopup);
    this._popupComponent.setAddToWatchlistHandler(this._handlePopupAddToWatchlistClick);
    this._popupComponent.setMarkAsWatchedHandler(this._handlePopupMarkAsWatchedClick);
    this._popupComponent.setAddFavoriteHandler(this._handlePopupFavoriteClick);
    this._popupComponent.setDeleteCommentHandler(this._handleDeleteCommentClick);
    this._popupComponent.setCommentSubmitHandler(this._handleFormSubmit);

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

    this._popupComponent = new FilmDetailsView(this._movie, this._commentsModel);
    this._popupComponent.setCloseFilmDetailsPopupHandler(this._removePopup);
    this._popupComponent.setAddToWatchlistHandler(this._handlePopupAddToWatchlistClick);
    this._popupComponent.setMarkAsWatchedHandler(this._handlePopupMarkAsWatchedClick);
    this._popupComponent.setAddFavoriteHandler(this._handlePopupFavoriteClick);
    this._popupComponent.setDeleteCommentHandler(this._handleDeleteCommentClick);
    this._popupComponent.setCommentSubmitHandler(this._handleFormSubmit);

    this._renderedMovieContainer = this._bodyElement.querySelector('.film-details');
    if (this._renderedMovieContainer !== null) {
      this._bodyElement.removeChild(this._renderedMovieContainer);
    }

    render(this._bodyElement, this._popupComponent);
    this._bodyElement.classList.add('hide-overflow');
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  _handleDeleteCommentClick(commentId) {
    const prevPopupScrollHeight = this._popupComponent.getElement().scrollTop;
    this._changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      Object.assign({}, this._movie, {
        comments: removeObjectFromSet(this._movie.comments, commentId),
        commentDetails: this._movie.commentDetails.filter((comment) => comment.id !== commentId),
      }),
      commentId,
    );
    this._popupComponent.getElement().scrollTop = prevPopupScrollHeight;
  }

  _removePopup() {
    remove(this._popupComponent);
    this._bodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.CLOSED;
  }

  _escKeyDownHandler(evt) {
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

  _getScrollY() {
    if (this._mode === Mode.CLOSED) {
      return;
    }
    return this._popupComponent.getElement().scrollTop;
  }

  _setScrollY(value) {
    if (this._mode === Mode.CLOSED) {
      return;
    }
    return (this._popupComponent.getElement().scrollTop = value);
  }

  _handleAddToWatchlistClick() {
    const prevPopupScrollHeight = this._getScrollY();
    this._changeData(
      UserAction.UPDATE_MOVIE,
      this._mode === Mode.CLOSED ? UpdateType.MINOR : UpdateType.PATCH,

      Object.assign({}, this._movie, {
        isWatchList: !this._movie.isWatchList,
      }),
    );
    this._setScrollY(prevPopupScrollHeight);
  }

  _handleMarkAsWatchedClick() {
    const prevPopupScrollHeight = this._getScrollY();
    this._changeData(
      UserAction.UPDATE_MOVIE,
      this._mode === Mode.CLOSED ? UpdateType.MINOR : UpdateType.PATCH,
      Object.assign({}, this._movie, {
        isAlreadyWatched: !this._movie.isAlreadyWatched,
        watchingDate : dayjs(),
      }),
    );
    this._setScrollY(prevPopupScrollHeight);
  }

  _handleFavoriteClick() {
    const prevPopupScrollHeight = this._getScrollY();
    this._changeData(
      UserAction.UPDATE_MOVIE,
      this._mode === Mode.CLOSED ? UpdateType.MINOR : UpdateType.PATCH,
      Object.assign(
        {},
        this._movie,
        (this._movie.isFavorite = !this._movie.isFavorite),
      ),
    );
    this._setScrollY(prevPopupScrollHeight);
  }

  _handlePopupAddToWatchlistClick() {
    const prevPopupScrollHeight = this._getScrollY();
    this._changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._movie,
        (this._movie.isWatchList = !this._movie.isWatchList),
      ),
    );
    this._setScrollY(prevPopupScrollHeight);
  }

  _handlePopupMarkAsWatchedClick() {
    const prevPopupScrollHeight = this._getScrollY();
    this._changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._movie,
        (this._movie.isAlreadyWatched = !this._movie.isAlreadyWatched),
        (this._movie.watchingDate = dayjs()),
      ),
    );
    this._setScrollY(prevPopupScrollHeight);
  }

  _handlePopupFavoriteClick() {
    const prevPopupScrollHeight = this._getScrollY();
    this._changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._movie,
        (this._movie.isFavorite = !this._movie.isFavorite),
      ),
    );
    this._setScrollY(prevPopupScrollHeight);
  }

  _handleFormSubmit(newComment) {
    const prevPopupScrollHeight = this._getScrollY();

    this._changeData(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      this._movie,
      newComment,
    );
    this._setScrollY(prevPopupScrollHeight);
  }
}
