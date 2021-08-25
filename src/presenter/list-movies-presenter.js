import { remove, render, RenderPosition } from '../utils/render.js';
import { MOVIES_COUNT_PER_STEP, SortType } from '../const.js';
// import { sortTopMoviesList, sortMostCommentedMoviesList } from '../utils/sort.js';
import { updateMovie } from '../mock/utils.js';
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
import { generateFilter } from '../mock/filter.js';


// const MAX  _EXTRA_MOVIES = 2;
export default class ListMoviesPresenter {
  constructor(siteMainContainer) {
    this._siteMainContainer = siteMainContainer;
    this._renderedMoviesCount = MOVIES_COUNT_PER_STEP;
    this._noFilmComponent = new NoFilmView();
    this._moviesContainer = new MoviesContainerView();
    this._listMoviesComponent = new ListMoviesView();
    this._showMoreComponent = new ShowMoreButtonView();
    this._topRatedListComponent = new ListExtraMoviesView('Top rated');
    this._mostCommentedListComponent = new ListExtraMoviesView('Most commented');
    this._siteSortComponent = new SiteSortView();
    this._headerProfileComponent = new HeaderProfileView();
    this._moviePresenter = new Map();
    this._handleMovieChange = this._handleMovieChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._currentSortType = SortType.DEFAULT;
  }

  init(allMovies, allComments, filters) {
    this._allMovies = allMovies.slice();
    this._originalAllMovies = allMovies.slice();
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


  _renderHeaderProfile() {
    this._headerProfileContainer = document.querySelector('.header');
    render(this._headerProfileContainer, this._headerProfileComponent);
  }

  _handleMovieChange(updatedFilm){
    this._allMovies = updateMovie(this._allMovies, updatedFilm);
    this._originalAllMovies = updateMovie(this._originalAllMovies, updatedFilm);
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
    render(this._listMoviesComponent, this._siteSortComponent, RenderPosition.AFTERBEGIN);
    this._siteSortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._sortMovies(sortType);
    this._clearMovieList();
    this._renderFeaturedMoviesList();
  }

  _sortMovies(sortType) {
    switch (sortType) {
      case SortType.BY_DATE:
        this._allMovies.sort(sortMoviesByDate);
        break;
      case SortType.BY_RATING:
        this._allMovies.sort(sortMoviesByRating);
        break;
      default: this._allMovies = this._originalAllMovies.slice();
    }
    this._currentSortType = sortType;

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
    const moviePresenter = new MoviePresenter(this._listMoviesComponent, this._handleMovieChange);
    moviePresenter.init(this._movieWithComments(movie));
    this._moviePresenter.set(movie.id, moviePresenter);
  }


  _clearMovieList() {
    this._moviePresenter.forEach((presenter) => presenter.removeCardMovie());
    this._moviePresenter.clear();
    this._renderedMoviesCount = 0;
    remove(this._showMoreComponent);
  }


  _handleShowMoreButtonClick() {
    this._renderFeaturedMoviesList(this._renderedMoviesCount, this._renderedMoviesCount + MOVIES_COUNT_PER_STEP);
    this._renderedMoviesCount += MOVIES_COUNT_PER_STEP;

    if (this._renderedMoviesCount >= this._allMovies.length) {
      remove(this._showMoreComponent);
    }
  }

  _renderShowMoreButton() {
    render( this._listMoviesComponent, this._showMoreComponent );
    this._showMoreComponent.setShowMoreMoviesHandler(this._handleShowMoreButtonClick);
  }


  _renderfooterStatistics() {
    this._footerStatisticsContainer = document.querySelector('.footer');
    render( this._footerStatisticsContainer, new FooterStatisticsView(this._allMovies.length) );
  }


  _renderFeaturedMoviesList(from, to) {
    this._allMovies
      .slice(from, to)
      .forEach((movie) => this._renderMovie(movie));
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

  _renderMovies() {
    this._renderFeaturedMoviesList(0, Math.min(this._allMovies.length, MOVIES_COUNT_PER_STEP));
    if (this._allMovies.length > MOVIES_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderAllMovies() {
    if (this._allMovies.length === 0) {
      this._renderNoMovies();
      return;
    }

    this._renderSort();

    this._renderMovies();
    // this._renderTopMoviesList();
    // this._renderMostCommentedMoviesList();
  }
}
