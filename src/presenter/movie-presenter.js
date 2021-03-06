import dayjs from 'dayjs';
import { UpdateType, UserAction } from '../const.js';
import { remove, render, replace } from '../utils/render.js';
import FilmCardView from '../view/film-card.js';
import FilmDetailsView from '../view/film-details.js';
import { isOnline } from '../utils/common.js';
import { toast } from '../utils/toast.js';

const Mode = {
  CLOSED: 'CLOSED',
  OPENED: 'OPENED',
};

const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

let scrollPosition;

const positionScrollY = {
  getY() {
    return scrollPosition;
  },
  setY(newScrollPosition) {
    scrollPosition = newScrollPosition;
  },
};

export default class MoviePresenter {
  constructor(listMoviesContainer, moviePresenter, changeMode, moviesModel, commentsModel, apiWithProvider) {
    this._changeMode = changeMode;
    this._moviePresenter = moviePresenter;
    this._moviesModel = moviesModel;
    this._apiWithProvider = apiWithProvider;
    this._commentsModel = commentsModel;
    this._listMoviesContainer = listMoviesContainer;
    this._listMoviesComponent = listMoviesContainer.getElement().querySelector('.films-list__container');
    this._bodyElement = document.querySelector('body');
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._openPopupHandler = this._openPopupHandler.bind(this);
    this._removePopup = this._removePopup.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleAddToWatchlistClick =  this._handleAddToWatchlistClick.bind(this);
    this._handleMarkAsWatchedClick = this._handleMarkAsWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handlePopupAddToWatchlistClick = this._handlePopupAddToWatchlistClick.bind(this);
    this._handlePopupMarkAsWatchedClick = this._handlePopupMarkAsWatchedClick.bind(this);
    this._handlePopupFavoriteClick = this._handlePopupFavoriteClick.bind(this);
    this._handleDeleteCommentClick = this._handleDeleteCommentClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
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

    if (prevMovieComponent === null && prevPopupComponent === null) {
      render(this._listMoviesComponent, this._movieComponent);
      return;
    }

    if (this._listMoviesContainer.getElement().contains(prevMovieComponent.getElement())){
      replace(this._movieComponent, prevMovieComponent);
    }


    if (prevPopupComponent) {
      replace(this._popupComponent, prevPopupComponent);
    }

    if (this._mode === Mode.OPENED) {
      this._rerenderPopup(this._movie);
      this._popupComponent.getElement().scrollTop = positionScrollY.getY();
    }

    remove(prevMovieComponent);
    remove(prevPopupComponent);
  }

  removeCardMovie() {
    remove(this._movieComponent);
  }

  resetView() {
    if (this._mode !== Mode.CLOSED) {
      this._removePopup();
    }
  }

  _setViewState(state, commentId) {
    if (this._mode === 'CLOSED') {
      return;
    }

    const resetFormState = () => {
      this._popupComponent.updateState({
        isDisabled: false,
        isSaving: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this._popupComponent.updateState({
          isDisabled: true,
        });
        break;

      case State.DELETING:
        this._popupComponent.updateState({
          isDisabled: true,
        });
        break;

      case State.ABORTING:
        this._popupComponent.shake(resetFormState, commentId);
        break;
    }
  }


  _handleViewAction(actionType, updateType, update, comment) {
    switch (actionType) {
      case UserAction.UPDATE_MOVIE:
        this._moviePresenter.get(update.id)._setViewState(State.SAVING);
        this._apiWithProvider.updateMovie(update)
          .then((response) => {
            this._moviesModel.updateMovie(updateType, response);
          });
        break;
      case UserAction.ADD_COMMENT:
        this._moviePresenter.get(update.id)._setViewState(State.SAVING);
        this._apiWithProvider.addComment(update, comment)
          .then((response) => {
            this._commentsModel.addComment(updateType, response.movie, response.comments);
            this._moviesModel.updateMovie(updateType, response.movie);
          }).catch(() => {
            const container = '.film-details__new-comment';
            this._moviePresenter.get(update.id)._setViewState(State.ABORTING, container);
          });
        break;
      case UserAction.DELETE_COMMENT:
        this._moviePresenter.get(update.id)._setViewState(State.DELETING, comment);
        this._apiWithProvider.deleteComment(comment)
          .then(() => {
            this._commentsModel.deleteComment(update, comment);
            this._moviesModel.updateMovie(updateType, update);
          })
          .catch(() => {
            const container = `[data-id="${comment}"]`;
            this._moviePresenter.get(update.id)._setViewState(State.ABORTING, container);
          });
        break;
      case UserAction.ABORT_COMMENT:
        this._moviePresenter.get(update.id)._setViewState(State.ABORTING, `[data-id="${comment}"]`);
        break;
    }
  }

  _handleModelEvent() {
    positionScrollY.setY(this._popupComponent.getElement().scrollTop);
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
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._commentsModel.addObserver(this._handleModelEvent);

    this._renderedMovieContainer = this._bodyElement.querySelector('.film-details');
    if (this._renderedMovieContainer !== null) {
      this._bodyElement.removeChild(this._renderedMovieContainer);
    }

    render(this._bodyElement, this._popupComponent);
    this._bodyElement.classList.add('hide-overflow');
    document.addEventListener('keydown', this._escKeyDownHandler);

    if (!isOnline()) {
      this._popupComponent.hideForm();
    }
  }

  _openPopupHandler() {
    this._apiWithProvider.getComments(this._movie.id)
      .then((comments) => {
        this._commentsModel.setComments(UpdateType.INIT, comments);
        this._renderPopup();
      })
      .catch(() => {
        this._commentsModel.setComments(UpdateType.INIT, []);
        this._renderPopup();
      });
  }

  _renderPopup() {
    this._changeMode();
    this._mode = Mode.OPENED;
    this._popupComponent = new FilmDetailsView(this._movie, this._commentsModel);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._commentsModel.addObserver(this._handleModelEvent);
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

    if (!isOnline()) {
      this._popupComponent.hideForm();
    }
  }

  _handleDeleteCommentClick(commentId) {
    if (!isOnline()) {
      toast('You can\'t delete comment offline');
      this._moviePresenter.get(this._movie.id)._setViewState(State.ABORTING, `[data-id="${commentId}"]`);
      return;
    }
    this._handleViewAction(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      Object.assign({}, this._movie, {
        comments: this._movie.comments.filter((movieCommentId) => movieCommentId !== commentId),
      }),
      commentId,
    );
  }

  _removePopup() {
    remove(this._popupComponent);
    this._bodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._commentsModel.removeObserver(this._handleModelEvent);
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

  _handleAddToWatchlistClick() {
    if (this._mode === Mode.OPENED) {
      positionScrollY.setY(this._popupComponent.getElement().scrollTop);
    }
    this._handleViewAction(
      UserAction.UPDATE_MOVIE,
      this._mode === Mode.CLOSED ? UpdateType.MINOR : UpdateType.PATCH,

      Object.assign({}, this._movie, {
        isWatchList: !this._movie.isWatchList,
      }),
    );
  }

  _handleMarkAsWatchedClick() {
    if (this._mode === Mode.OPENED) {
      positionScrollY.setY(this._popupComponent.getElement().scrollTop);
    }
    this._handleViewAction(
      UserAction.UPDATE_MOVIE,
      this._mode === Mode.CLOSED ? UpdateType.MINOR : UpdateType.PATCH,
      Object.assign({}, this._movie, {
        isAlreadyWatched: !this._movie.isAlreadyWatched,
        watchingDate : dayjs(),
      }),
    );
  }

  _handleFavoriteClick() {
    if (this._mode === Mode.OPENED) {
      positionScrollY.setY(this._popupComponent.getElement().scrollTop);
    }
    this._handleViewAction(
      UserAction.UPDATE_MOVIE,
      this._mode === Mode.CLOSED ? UpdateType.MINOR : UpdateType.PATCH,
      Object.assign(
        {},
        this._movie,
        (this._movie.isFavorite = !this._movie.isFavorite),
      ),
    );
  }

  _handlePopupAddToWatchlistClick() {
    positionScrollY.setY(this._popupComponent.getElement().scrollTop);
    this._handleViewAction(
      UserAction.UPDATE_MOVIE,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._movie,
        (this._movie.isWatchList = !this._movie.isWatchList),
      ),
    );
  }

  _handlePopupMarkAsWatchedClick() {
    positionScrollY.setY(this._popupComponent.getElement().scrollTop);
    this._handleViewAction(
      UserAction.UPDATE_MOVIE,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._movie,
        (this._movie.isAlreadyWatched = !this._movie.isAlreadyWatched),
        (this._movie.watchingDate = dayjs()),
      ),
    );
  }

  _handlePopupFavoriteClick() {

    positionScrollY.setY(this._popupComponent.getElement().scrollTop);
    this._handleViewAction(
      UserAction.UPDATE_MOVIE,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._movie,
        (this._movie.isFavorite = !this._movie.isFavorite),
      ),
    );
  }

  _handleFormSubmit(newComment) {
    if (!isOnline()) {
      toast('You can\'t add comment offline');
      this._handleViewAction(
        UserAction.ADD_COMMENT,
        UpdateType.PATCH,
        this._movie,
        newComment,
      );
      return;
    }

    this._handleViewAction(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      this._movie,
      newComment,
    );
  }
}
