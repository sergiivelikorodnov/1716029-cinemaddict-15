import { removeComponent, render, RenderPosition } from '../utils/render.js';
import { MOVIES_COUNT_PER_STEP } from '../const.js';
import { sortTopMoviesList, sortMostCommentedMoviesList, filterComments } from '../utils/sort.js';
import FilmCardView from '../view/film-card.js';
import ListMoviesView from '../view/list-movies.js';
import NoFilmView from '../view//no-film.js';
import ListExtraMoviesView from '../view/list-extra-movies.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import FilmDetailsView from '../view/film-details.js';
import FilmCommentView from '../view/film-comment.js';
import SiteSortView from '../view/site-sort.js';
import FooterStatisticsView from '../view/footer-statistics.js';
import HeaderProfileView from '../view/header-profile.js';
import SiteMenuView from '../view/site-menu.js';


const MAX_EXTRA_MOVIES = 2;

export default class ListMoviesPresenter {
  constructor(siteMainContainer) {
    this._siteMainContainer = siteMainContainer;
    this._noFilmComponent = new NoFilmView();
    this._listMoviesComponent = new ListMoviesView();
    this._showMoreComponent = new ShowMoreButtonView();
    this._topRatedListComponent = new ListExtraMoviesView('Top rated');
    this._mostCommentedListComponent = new ListExtraMoviesView('Most commented');
    this._siteSortComponent = new SiteSortView();
    this._headerProfileComponent = new HeaderProfileView();
    this._listMoviesMap = new Map();
  }

  init(allMovies, allComments, filters) {
    this._allMovies = allMovies.slice();
    this._allComments = allComments.slice();
    this._filters = filters.slice();

    render(this._siteMainContainer, new SiteMenuView(this._filters));
    render(this._siteMainContainer, this._siteSortComponent);
    render(this._siteMainContainer, this._listMoviesComponent);

    this._renderHeaderProfile();
    this._renderAllMovies();
    this._renderfooterStatistics();
  }

  /**
  * Header Profile
  */

  _renderHeaderProfile() {
    this._headerProfileContainer = document.querySelector('.header');
    render(this._headerProfileContainer, this._headerProfileComponent);
  }

  /**
  * Single Movie Card
  */
  _renderMovie(movieElement, movie) {
    const movieComponent = new FilmCardView(movie);
    this._listMoviesMap.set(movie.id, movieComponent);
    render(movieElement, movieComponent);

    movieComponent.setOpenFilmDetailsPopupHandler(() => {
      this._renderFilmDetails(movie);
    });

    movieComponent.setAddToWatchlistHandler(() => {
      this._sortMovies();
    });

    movieComponent.setMarkAsWatchedHandler(() => {
      //console.log(this._movieComponent._movie.id);

    });

    movieComponent.setAddFavoriteHandler(() => {
      //this._renderFilmDetails(movie);
    });

  }

  /**
  * Single Movie Popup Details
  */

  _renderFilmDetails(someFilm) {
    this._bodyContainer = document.querySelector('body');
    this._renderedMovieContainer = this._bodyContainer.querySelector('.film-details');
    if (this._renderedMovieContainer !== null) {
      this._bodyContainer.removeChild(this._renderedMovieContainer);
    }

    this._openedMovieDetailsComponent = new FilmDetailsView(someFilm);
    this._bodyContainer.appendChild(this._openedMovieDetailsComponent.getElement());

    this._filmDetailsCommentList = this._openedMovieDetailsComponent.getElement().querySelector('.film-details__comments-list' );
    someFilm.comments.forEach((commentIndex) =>
      render(this._filmDetailsCommentList, new FilmCommentView(filterComments(this._allComments, 'id', commentIndex)),  RenderPosition.BEFOREBEGIN ),
    );

    this._bodyContainer.classList.add('hide-overflow');

    this._onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        this._bodyContainer.classList.remove('hide-overflow');
        removeComponent(this._openedMovieDetailsComponent);
        this._bodyContainer.removeEventListener('keydown', this._onEscKeyDown);
      }
    };

    this._closeButtonHandler = () => {
      document.removeEventListener('keydown', this._onEscKeyDown);
      this._bodyContainer.classList.remove('hide-overflow');
      removeComponent(this._openedMovieDetailsComponent);
    };

    this._openedMovieDetailsComponent.setCloseFilmDetailsPopupHandler(this._closeButtonHandler);
    document.addEventListener('keydown', this._onEscKeyDown);

    this._openedMovieDetailsComponent.setAddToWatchlistHandler(() => {

    });

    this._openedMovieDetailsComponent.setMarkAsWatchedHandler(() => {

    });

    this._openedMovieDetailsComponent.setAddFavoriteHandler(() => {

    });
  }

  /**
  * Featured Movies List
  */

  _renderFeaturedMoviesList() {
    this._featureListContainer = this._listMoviesComponent.getElement().querySelector('.films-list__container');
    if (this._allMovies.length === 0) {
      render( this._featureListContainer, this._noFilmComponent );
    } else {
      for (let i = 0; i < Math.min(this._allMovies.length, MOVIES_COUNT_PER_STEP); i++) {
        this._renderMovie(this._featureListContainer, this._allMovies[i]);
      }
    }
  }

  /**
  * Top Movies List
  */

  _renderTopMoviesList() {
    this._topMoviesList = sortTopMoviesList(this._allMovies);

    if (this._topMoviesList.length > 0) {
      render( this._listMoviesComponent, this._topRatedListComponent );

      for (let i = 0; i < Math.min(this._topMoviesList.length, MAX_EXTRA_MOVIES); i++) {
        this._renderMovie(this._topRatedListComponent.getElement().querySelector('.films-list__container'), this._topMoviesList[i]);
      }
    }
  }

  /**
  * Most Commented Movies List
  */

  _renderMostCommentedMoviesList() {
    this._mostCommentedMoviesList = sortMostCommentedMoviesList(this._allMovies);

    if ( this._mostCommentedMoviesList.length > 0) {
      render(this._listMoviesComponent, this._mostCommentedListComponent);

      for (let i = 0; i < Math.min( this._mostCommentedMoviesList.length, MAX_EXTRA_MOVIES); i++) {
        this._renderMovie( this._mostCommentedListComponent.getElement().querySelector('.films-list__container'),  this._mostCommentedMoviesList[i]);
      }
    }
  }

  /**
  * Show More Button
  */

  _renderShowMoreButton() {
    if (this._allMovies.length > MOVIES_COUNT_PER_STEP) {
      this._renderedMoviesCount = MOVIES_COUNT_PER_STEP;

      this._featureList = this._listMoviesComponent.getElement().querySelector('.films-list');
      render( this._featureList, this._showMoreComponent );

      this._showMoreComponent.setShowMoreMoviesHandler(() => {
        this._allMovies
          .slice(this._renderedMoviesCount, this._renderedMoviesCount + MOVIES_COUNT_PER_STEP)
          .forEach((movie) =>
            this._renderMovie(this._featureListContainer, movie),
          );
        this._renderedMoviesCount += MOVIES_COUNT_PER_STEP;
        if (this._renderedMoviesCount > this._allMovies.length) {
          this._showMoreComponent.getElement().remove();
        }
      });
    }
  }

  /**
  * Footer Statistics
  */

  _renderfooterStatistics() {
    this._footerStatisticsContainer = document.querySelector('.footer');
    render( this._footerStatisticsContainer, new FooterStatisticsView(this._allMovies.length) );
  }

  /**
  * Clear Movies List
  */
  _clearMoviesist() {
    this._destroy(this._topRatedListComponent);
    this._destroy(this._mostCommentedListComponent);
    this._listMoviesMap.forEach((movie) => this._destroy(movie));
    this._listMoviesMap.clear();
    this._renderedMoviesCount = MOVIES_COUNT_PER_STEP;
    removeComponent(this._showMoreComponent);
  }

  /**
  * Remove card
  */
  _destroy(movieComponent) {
    removeComponent(movieComponent);
  }

  /**
  * Sort All Movies List
  */

  _sortMovies() {
    this._clearMoviesist();
    this._renderAllMovies();
  }

  /**
  * Render All Movies List
  */

  _renderAllMovies() {
    this._renderTopMoviesList();
    this._renderMostCommentedMoviesList();
    this._renderFeaturedMoviesList();
    this._renderShowMoreButton();
  }
}
