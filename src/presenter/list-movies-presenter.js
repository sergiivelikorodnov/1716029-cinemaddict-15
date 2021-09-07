import { remove, render, RenderPosition } from '../utils/render.js';
import {
  MOVIES_COUNT_PER_STEP,
  SortType,
  UpdateType,
  UserAction,
  FilterType
} from '../const.js';
import ListMoviesView from '../view/list-movies.js';
import LoadingView from '../view/loading.js';
import MoviesContainerView from '../view/movies-container.js';
import NoFilmView from '../view//no-film.js';
import ListExtraMoviesView from '../view/list-extra-movies.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import SiteSortView from '../view/site-sort.js';
import FooterStatisticsView from '../view/footer-statistics.js';
import HeaderProfileView from '../view/header-profile.js';
import MoviePresenter from './movie-presenter.js';
import { sortMoviesByDate, sortMoviesByRating } from '../utils/sort.js';
import { filter } from '../utils/filter.js';
import { getWatchedMoviesCount } from '../utils/statistics.js';

export default class ListMoviesPresenter {
  constructor(siteMainContainer, moviesModel, filtersModel, commentsModel, api) {
    this._commentsModel = commentsModel;
    this._moviesModel = moviesModel;
    this._filtersModel = filtersModel;
    this._siteMainContainer = siteMainContainer;
    this._api = api;
    this._renderedMoviesCount = MOVIES_COUNT_PER_STEP;
    this._filterType = FilterType.ALL;
    this._headerProfileComponent = new HeaderProfileView(getWatchedMoviesCount(this._moviesModel.getMovies()));
    this._noFilmComponent = null;
    this._moviesContainer = new MoviesContainerView();
    this._listMoviesComponent = new ListMoviesView();
    this._showMoreComponent = null;
    this._topRatedListComponent = new ListExtraMoviesView('Top rated');
    this._mostCommentedListComponent = new ListExtraMoviesView(
      'Most commented',
    );
    this._siteSortComponent = null;
    this._moviePresenter = new Map();
    this._isLoading = true;
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handlePopupMode = this._handlePopupMode.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._loadingComponent = new LoadingView();
    this._currentSortType = SortType.DEFAULT;
  }

  init() {
    render(this._siteMainContainer, this._moviesContainer);
    render(this._moviesContainer, this._listMoviesComponent);
    this._moviesModel.addObserver(this._handleModelEvent);
    this._filtersModel.addObserver(this._handleModelEvent);

    this._renderAllMovies();

  }

  hideMoviesList() {
    this._clearMovieList({ resetRenderedMoviesCount: true, resetSortType: true });
    remove(this._listMoviesComponent);

    this._moviesModel.removeObserver(this._handleModelEvent);
    this._filtersModel.removeObserver(this._handleModelEvent);
  }

  _renderLoading() {
    render(this._listMoviesComponent, this._loadingComponent);
  }

  _getMovies() {
    this._filterType = this._filtersModel.getFilter();

    const movies = this._moviesModel.getMovies().slice();
    const filteredMovies = filter[this._filterType](movies);

    switch (this._currentSortType) {
      case SortType.BY_DATE:
        return filteredMovies.sort(sortMoviesByDate);
      case SortType.BY_RATING:
        return filteredMovies.sort(sortMoviesByRating);
    }
    return filteredMovies;
  }

  _handleViewAction(actionType, updateType, update, comment) {
    switch (actionType) {
      case UserAction.UPDATE_MOVIE:
        this._moviesModel.updateMovie(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this._commentsModel.addComment(updateType, update, comment);
        this._moviesModel.updateMovie(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this._commentsModel.deleteComment(update, comment);
        this._moviesModel.updateMovie(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._moviePresenter.get(data.id).init(data);
        this._renderHeaderProfile();
        break;
      case UpdateType.MINOR:
        this._clearMovieList();
        this._renderAllMovies();
        this._renderHeaderProfile();
        break;
      case UpdateType.MAJOR:
        this._clearMovieList({
          resetRenderedMoviesCount: true,
          resetSortType: true,
        });
        this._renderAllMovies();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderAllMovies();
        this._renderfooterStatistics();
        break;
    }
  }

  _renderNoMovies() {
    this._noFilmComponent = new NoFilmView(this._filterType);
    render(this._listMoviesComponent, this._noFilmComponent);
  }

  _renderHeaderProfile() {
    if (this._headerProfileComponent !== null) {
      remove(this._headerProfileComponent);
    }

    this._headerProfileComponent = new HeaderProfileView(getWatchedMoviesCount(this._moviesModel.getMovies()));
    this._headerProfileContainer = document.querySelector('.header');
    render(this._headerProfileContainer, this._headerProfileComponent);
  }

  _renderMovie(movie) {
    const moviePresenter = new MoviePresenter(
      this._listMoviesComponent,
      this._handleViewAction,
      this._handlePopupMode,
      this._commentsModel,
      this._api,
    );
    moviePresenter.init(movie);
    this._moviePresenter.set(movie.id, moviePresenter);
  }

  _renderFeaturedMoviesList(movies) {
    movies.forEach((movie) => this._renderMovie(movie));
  }

  _clearMovieList({
    resetRenderedMoviesCount = false,
    resetSortType = false,
  } = {}) {
    const moviesCount = this._getMovies().length;

    this._moviePresenter.forEach((presenter) => presenter.removeCardMovie());
    this._moviePresenter.clear();

    remove(this._siteSortComponent);
    remove(this._loadingComponent);
    remove(this._showMoreComponent);

    if (this._noFilmComponent) {
      remove(this._noFilmComponent);
    }

    if (resetRenderedMoviesCount) {
      this._renderedTaskCount = MOVIES_COUNT_PER_STEP;
    } else {
      this._renderedTaskCount = Math.min(
        moviesCount,
        this._renderedMoviesCount,
      );
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderShowMoreButton() {
    if (this._showMoreComponent !== null) {
      this._showMoreComponent = null;
    }
    this._showMoreComponent = new ShowMoreButtonView();
    render(this._listMoviesComponent, this._showMoreComponent);
    this._showMoreComponent.setShowMoreMoviesHandler(
      this._handleShowMoreButtonClick,
    );
  }

  _renderfooterStatistics() {
    this._footerStatisticsContainer = document.querySelector('.footer');
    render(
      this._footerStatisticsContainer,
      new FooterStatisticsView(this._getMovies().length),
    );
  }

  _renderSort() {
    if (this._siteSortComponent !== null) {
      this._siteSortComponent = null;
    }

    this._siteSortComponent = new SiteSortView(this._currentSortType);
    render(
      this._listMoviesComponent,
      this._siteSortComponent,
      RenderPosition.AFTERBEGIN,
    );
    this._siteSortComponent.setSortTypeChangeHandler(
      this._handleSortTypeChange,
    );
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;

    this._clearMovieList({ resetRenderedMoviesCount: true });
    this._renderAllMovies();
  }

  _handlePopupMode() {
    this._moviePresenter.forEach((presenter) => presenter.resetView());
  }

  _handleShowMoreButtonClick() {
    const moviesCount = this._getMovies().length;
    const newRenderedMovies = Math.min(
      moviesCount,
      this._renderedMoviesCount + MOVIES_COUNT_PER_STEP,
    );
    const movies = this._getMovies().slice(
      this._renderedMoviesCount,
      newRenderedMovies,
    );
    this._renderFeaturedMoviesList(movies);
    this._renderedMoviesCount = newRenderedMovies;

    if (this._renderedMoviesCount >= moviesCount) {
      remove(this._showMoreComponent);
    }
  }

  _renderAllMovies() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const movies = this._getMovies();
    const moviesCount = movies.length;

    if (moviesCount === 0) {
      this._renderNoMovies();
      return;
    }

    this._renderHeaderProfile();
    this._renderSort();

    this._renderFeaturedMoviesList(
      movies.slice(0, Math.min(moviesCount, this._renderedMoviesCount)),
    );

    if (moviesCount > this._renderedMoviesCount) {
      this._renderShowMoreButton();
    }
  }
}
