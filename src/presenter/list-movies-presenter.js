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
    this._listMoviesElement = new ListMoviesView();
    this._showMore = new ShowMoreButtonView();
    this._topRatedListContainer = new ListExtraMoviesView('Top rated');
    this._mostCommentedListContainer = new ListExtraMoviesView('Most commented');
    this._siteSortComponent = new SiteSortView();
    this._headerProfileComponent = new HeaderProfileView();
  }

  init(allMovies, allComments, filters) {
    this._allMovies = allMovies.slice();
    this._allComments = allComments.slice();
    this._filters = filters.slice();

    render(this._siteMainContainer, new SiteMenuView(this._filters), RenderPosition.BEFOREBEGIN);
    render(this._siteMainContainer, this._siteSortComponent, RenderPosition.BEFOREBEGIN);
    render(this._siteMainContainer, this._listMoviesElement, RenderPosition.BEFOREBEGIN);

    this._renderHeaderProfile();
    this._renderAllMovies();
    this._renderfooterStatistics();
  }

  /**
  * Header Profile
  */

  _renderHeaderProfile() {
    this._headerProfileContainer = document.querySelector('.header');
    render(this._headerProfileContainer, this._headerProfileComponent, RenderPosition.BEFOREBEGIN);
  }

  /**
  * Single Movie Card
  */

  _renderMovie(movieElement, movie) {
    this._movieComponent = new FilmCardView(movie);
    render(movieElement, this._movieComponent, RenderPosition.BEFOREBEGIN);

    this._movieComponent.setClickHandler(() => {
      this._renderFilmDetails(movie);
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

    this._openedMovieDetailsComponent.setClickHandler(this._closeButtonHandler);
    document.addEventListener('keydown', this._onEscKeyDown);
  }

  /**
  * Featured Movies List
  */

  _renderFeaturedMoviesList() {
    this._featureListContainer = this._listMoviesElement.getElement().querySelector('.films-list__container');
    if (this._allMovies.length === 0) {
      render( this._featureListContainer, this._noFilmComponent, RenderPosition.BEFOREBEGIN );
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
      render( this._listMoviesElement, this._topRatedListContainer, RenderPosition.BEFOREBEGIN );

      for (let i = 0; i < Math.min(this._topMoviesList.length, MAX_EXTRA_MOVIES); i++) {
        this._renderMovie(this._topRatedListContainer.getElement().querySelector('.films-list__container'), this._topMoviesList[i]);
      }
    }
  }

  /**
  * Most Commented Movies List
  */

  _renderMostCommentedMoviesList() {
    this._mostCommentedMoviesList = sortMostCommentedMoviesList(this._allMovies);

    if ( this._mostCommentedMoviesList.length > 0) {
      render(this._listMoviesElement, this._mostCommentedListContainer, RenderPosition.BEFOREBEGIN);

      for (let i = 0; i < Math.min( this._mostCommentedMoviesList.length, MAX_EXTRA_MOVIES); i++) {
        this._renderMovie( this._mostCommentedListContainer.getElement().querySelector('.films-list__container'),  this._mostCommentedMoviesList[i]);
      }
    }
  }

  /**
  * Show More Button
  */

  _renderShowMoreButton() {
    if (this._allMovies.length > MOVIES_COUNT_PER_STEP) {
      this._renderedMoviesCount = MOVIES_COUNT_PER_STEP;

      this._featureList = this._listMoviesElement.getElement().querySelector('.films-list');
      render( this._featureList, this._showMore, RenderPosition.BEFOREBEGIN );

      this._showMore.setClickHandler(() => {
        this._allMovies
          .slice(this._renderedMoviesCount, this._renderedMoviesCount + MOVIES_COUNT_PER_STEP)
          .forEach((movie) =>
            this._renderMovie(this._featureListContainer, movie),
          );
        this._renderedMoviesCount += MOVIES_COUNT_PER_STEP;
        if (this._renderedMoviesCount > this._allMovies.length) {
          this._showMore.getElement().remove();
        }
      });
    }
  }

  /**
  * Footer Statistics
  */

  _renderfooterStatistics() {
    this._footerStatisticsContainer = document.querySelector('.footer');
    render( this._footerStatisticsContainer, new FooterStatisticsView(this._allMovies.length), RenderPosition.BEFOREBEGIN );
  }

  /**
  * Render All Movies List
  */

  _renderAllMovies() {
    this._renderFeaturedMoviesList();
    this._renderShowMoreButton();
    this._renderTopMoviesList();
    this._renderMostCommentedMoviesList();
  }
}
