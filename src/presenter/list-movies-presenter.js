import { remove, render, RenderPosition } from '../utils/render.js';
import { MOVIES_COUNT_PER_STEP, SortType, UpdateType, UserAction } from '../const.js';
// import { sortTopMoviesList, sortMostCommentedMoviesList } from '../utils/sort.js';
import ListMoviesView from '../view/list-movies.js';
import MoviesContainerView from '../view/movies-container.js';
import NoFilmView from '../view//no-film.js';
import ListExtraMoviesView from '../view/list-extra-movies.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import SiteSortView from '../view/site-sort.js';
import FooterStatisticsView from '../view/footer-statistics.js';
import HeaderProfileView from '../view/header-profile.js';
import SiteMenuView from '../view/site-menu.js';
import MoviePresenter from './movie-presenter.js';
import { sortMoviesByDate, sortMoviesByRating } from '../utils/sort.js';
import { generateFilter } from '../utils/filter.js';


// const MAX  _EXTRA_MOVIES = 2;
export default class ListMoviesPresenter {
  constructor(siteMainContainer, moviesModel) {
    this._moviesModel = moviesModel;
    this._siteMainContainer = siteMainContainer;
    this._renderedMoviesCount = MOVIES_COUNT_PER_STEP;
    this._noFilmComponent = new NoFilmView();
    this._moviesContainer = new MoviesContainerView();
    this._listMoviesComponent = new ListMoviesView();
    this._showMoreComponent = null;
    this._topRatedListComponent = new ListExtraMoviesView('Top rated');
    this._mostCommentedListComponent = new ListExtraMoviesView('Most commented');
    this._siteSortComponent = null;
    this._headerProfileComponent = new HeaderProfileView();
    this._moviePresenter = new Map();
    this._handleMovieChange = this._handleMovieChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handlePopupMode = this._handlePopupMode.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._moviesModel.addObserver(this._handleModelEvent);
    this._currentSortType = SortType.DEFAULT;
  }

  init(allComments, filters) {
    this._allComments = allComments.slice();
    this._filters = filters.slice();
    this._siteMenuComponent = new SiteMenuView(this._filters);

    render(this._siteMainContainer, this._siteMenuComponent);
    render(this._siteMainContainer, this._moviesContainer);
    render(this._moviesContainer, this._listMoviesComponent);

    this._renderHeaderProfile();
    this._renderAllMovies();
    this._renderfooterStatistics();

  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_TASK:
        this._moviesModel.updateMovie(updateType, update);
        break;
      case UserAction.ADD_TASK:
        this._moviesModel.addMovie(updateType, update);
        break;
      case UserAction.DELETE_TASK:
        this._moviesModel.deleteMovie(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:

        this._moviePresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this._clearMovieList();
        this._renderAllMovies();
        break;
      case UpdateType.MAJOR:
        this._clearMovieList({ resetRenderedMoviesCount: true, resetSortType: true });
        this._renderAllMovies();
        break;
    }
  }

  _getMovies() {
    switch (this._currentSortType) {
      case SortType.BY_DATE:
        return this._moviesModel.getMovies().slice().sort(sortMoviesByDate);
      case SortType.BY_RATING:
        return this._moviesModel.getMovies().slice().sort(sortMoviesByRating);
    }
    return this._moviesModel.getMovies();
  }

  _handlePopupMode() {
    this._moviePresenter.forEach((presenter) => presenter.resetView);
  }

  _renderHeaderProfile() {
    this._headerProfileContainer = document.querySelector('.header');
    render(this._headerProfileContainer, this._headerProfileComponent);
  }

  _handleMovieChange(updatedFilm){
    this._moviePresenter.get(updatedFilm.id).init(updatedFilm);
    this._updateFilters(generateFilter(this._allMovies));
  }

  _updateFilters(filters) {
    remove(this._siteMenuComponent);
    this._siteMenuComponent = new SiteMenuView(filters);
    render(this._siteMainContainer,this._siteMenuComponent, RenderPosition.AFTERBEGIN);
  }

  _renderNoMovies() {
    render(this._listMoviesComponent, this._noFilmComponent);
  }


  _renderSort() {
    if (this._siteSortComponent !== null) {
      this._siteSortComponent = null;
    }

    this._siteSortComponent = new SiteSortView(this._currentSortType);
    render(this._listMoviesComponent, this._siteSortComponent, RenderPosition.AFTERBEGIN);
    this._siteSortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;

    this._clearMovieList({resetRenderedMoviesCount: true});
    this._renderAllMovies();
  }

  _movieWithComments(movie) {
    movie = Object.assign(
      {},
      movie,
      {
        commentDetails: this._allComments.filter((element) => movie.comments.has(element.id)),
      },
    );
    return movie;
  }

  _renderMovie(movie) {
    const moviePresenter = new MoviePresenter(this._listMoviesComponent, this._handleViewAction, this._handlePopupMode);
    moviePresenter.init(this._movieWithComments(movie));
    this._moviePresenter.set(movie.id, moviePresenter);
  }


  _clearMovieList({ resetRenderedMoviesCount = false, resetSortType = false } = {}) {
    const moviesCount = this._getMovies().length;
    this._moviePresenter.forEach((presenter) => presenter.removeCardMovie());
    this._moviePresenter.clear();

    remove(this._siteSortComponent);
    remove(this._noFilmComponent);
    remove(this._showMoreComponent);

    if (resetRenderedMoviesCount) {
      this._renderedTaskCount = MOVIES_COUNT_PER_STEP;
    } else {
      this._renderedTaskCount = Math.min(moviesCount, this._renderedMoviesCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }


  _handleShowMoreButtonClick() {
    const moviesCount = this._getMovies().length;
    const newRenderedMovies = Math.min(moviesCount, this._renderedMoviesCount + MOVIES_COUNT_PER_STEP);
    const movies = this._getMovies().slice(this._renderedMoviesCount, newRenderedMovies);
    this._renderFeaturedMoviesList(movies);
    this._renderedMoviesCount = newRenderedMovies;

    if (this._renderedMoviesCount >= moviesCount) {
      remove(this._showMoreComponent);
    }
  }

  _renderShowMoreButton() {
    if (this._showMoreComponent !== null) {
      this._showMoreComponent = null;
    }
    this._showMoreComponent = new ShowMoreButtonView();
    render( this._listMoviesComponent, this._showMoreComponent );
    this._showMoreComponent.setShowMoreMoviesHandler(this._handleShowMoreButtonClick);
  }


  _renderfooterStatistics() {
    this._footerStatisticsContainer = document.querySelector('.footer');
    render( this._footerStatisticsContainer, new FooterStatisticsView(this._getMovies().length) );
  }


  _renderFeaturedMoviesList(movies) {
    movies.forEach((movie) => this._renderMovie(movie));
  }

  _renderMovieItems() {

    const moviesCount = this._getMovies().length;
    const movies = this._getMovies().slice(0, Math.min(moviesCount, MOVIES_COUNT_PER_STEP));
    this._renderFeaturedMoviesList(movies);

    if (this._renderedMoviesCount >= moviesCount) {
      remove(this._showMoreComponent);
    }
  }

  // _renderTopRatedMovie(movie) {
  //   const moviePresenter = new MoviePresenter(this._topRatedListComponent, this._allComments, this._handleMovieChange);
  //   moviePresenter.init(movie);
  //   this._listMoviesMap.set(movie.id, this.moviePresenter);
  // }

  // _renderMostCommentedMovie(movie) {
  //   const moviePresenter = new MoviePresenter(this._mostCommentedListComponent, this._allComments, this._handleMovieChange);
  //   moviePresenter.init(movie);
  //   this._listMoviesMap.set(movie.id, this.moviePresenter);
  // }

  // _renderTopMoviesList() {
  //   this._topMoviesList = sortTopMoviesList(this._allMovies);

  //   if (this._topMoviesList.length > 0) {
  //     render( this._moviesContainer, this._topRatedListComponent );

  //     for (let i = 0; i < Math.min(this._topMoviesList.length, MAX_EXTRA_MOVIES); i++) {
  //       this._renderTopRatedMovie(this._topMoviesList[i]);

  //     }
  //   }
  // }

  /**
  * Most Commented Movies List
  */

  // _renderMostCommentedMoviesList() {
  //   this._mostCommentedMoviesList = sortMostCommentedMoviesList(this._allMovies);

  //   if ( this._mostCommentedMoviesList.length > 0) {
  //     render(this._moviesContainer, this._mostCommentedListComponent);

  //     for (let i = 0; i < Math.min( this._mostCommentedMoviesList.length, MAX_EXTRA_MOVIES); i++) {
  //       this._renderMostCommentedMovie( this._mostCommentedMoviesList[i]);

  //     }
  //   }
  // }

  _renderAllMovies() {
    const movies = this._getMovies();
    const moviesCount = movies.length;

    if (moviesCount === 0) {
      this._renderNoMovies();
      return;
    }

    this._renderSort();

    this._renderFeaturedMoviesList(movies.slice(0, Math.min(moviesCount, this._renderedMoviesCount)));

    if (moviesCount > this._renderedMoviesCount) {
      this._renderShowMoreButton();
    }
    // this._renderTopMoviesList();
    // this._renderMostCommentedMoviesList();
  }
}
