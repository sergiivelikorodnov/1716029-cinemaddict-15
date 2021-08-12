import {
  MOVIES_COUNT_PER_STEP,
  topMoviesList,
  mostCommentedMoviesList,
  MAX_EXTRA_MOVIES
} from './const.js';
import FooterStatisticsView from './view/footer-statistics.js';
import { render, RenderPosition } from './utils/render.js';
import HeaderProfileView from './view/header-profile.js';
import SiteMenuFiltersTemplateView from './view/site-menu.js';
import SiteSortTemplateView from './view/site-sort.js';
import ListMoviesLayoutView from './view/list-movies-template.js';
import ExtraListMoviesLayoutView from './view/list-extra-movies-template.js';
import ShowMoreButtonView from './view/show-more-button.js';
import FilmCardView from './view//film-card.js';
import NoFilmView from './view//no-film.js';
import { allComments } from './mock/comments.js';
import { allMovies } from './mock/movie.js';
import { generateFilter } from './mock/filter.js';
import FilmDetailsView from './view/film-details.js';
import CommentView from './view/film-comment.js';

const filters = generateFilter(allMovies);

const siteMainElement = document.querySelector('.main');
const headerProfile = document.querySelector('.header');
const footerStatistics = document.querySelector('.footer');
const body = document.querySelector('body');

const films = new ListMoviesLayoutView();
const featureList = films.getElement().querySelector('.films-list');
const featureListContainer = films.getElement().querySelector('.films-list__container');

render( headerProfile, new HeaderProfileView(), RenderPosition.BEFOREBEGIN );
render( siteMainElement, new SiteMenuFiltersTemplateView(filters), RenderPosition.BEFOREBEGIN );
render( siteMainElement, new SiteSortTemplateView(), RenderPosition.BEFOREBEGIN );
render( siteMainElement, films, RenderPosition.BEFOREBEGIN );

/**
 * Movie Details
 */

let isOpen;
let openedMovieDetails;

const renderFilmDetails = (someFilm) => {
  if (!isOpen) {
    openedMovieDetails = new FilmDetailsView(someFilm).getElement();
    body.appendChild(openedMovieDetails);
    isOpen = true;
  } else {
    const newOpenedMovie = new FilmDetailsView(someFilm).getElement();
    body.replaceChild(newOpenedMovie, openedMovieDetails);
    openedMovieDetails = newOpenedMovie;
  }

  const filmDetailsCommentList = openedMovieDetails.querySelector('.film-details__comments-list' );
  const filterComments = (someComments, commentKey, commentValue) => someComments.filter((comment) => comment[commentKey] === commentValue);
  someFilm.comments.forEach((index) =>
    render(filmDetailsCommentList, new CommentView(filterComments(allComments, 'id', index)),  RenderPosition.BEFOREBEGIN ),
  );

  body.classList.add('hide-overflow');
  const closeButton = openedMovieDetails.querySelector('.film-details__close-btn');


  /**
   * Esc button
   */
  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      body.classList.remove('hide-overflow');
      isOpen = false;
      body.removeChild(openedMovieDetails);
      body.removeEventListener('keydown', onEscKeyDown);
    }
  };

  const closeButtonHandler = (evt) => {
    evt.preventDefault();
    body.removeEventListener('keydown', onEscKeyDown);
    body.classList.remove('hide-overflow');
    isOpen = false;
    body.removeChild(openedMovieDetails);
  };

  /**
   * Close Listeners
   */
  body.addEventListener('keydown', onEscKeyDown);
  closeButton.addEventListener('click', closeButtonHandler);


};

/**
 * Render Movie
 */
const renderMovie = (movieElement, movie) => {
  const movieComponent = new FilmCardView(movie);
  render(movieElement, movieComponent, RenderPosition.BEFOREBEGIN);

  movieComponent.getElement().addEventListener('click', (evt) => {
    if (evt.target.matches('.film-card__poster') || evt.target.matches('.film-card__title') || evt.target.matches('.film-card__comments') ) {
      evt.preventDefault();
      renderFilmDetails(movie);
    }
  });
};

/**
 * Featured List Movies
 */
if (allMovies.length === 0) {
  render( featureListContainer, new NoFilmView(), RenderPosition.BEFOREBEGIN );
} else {
  for (let i = 0; i < Math.min(allMovies.length, MOVIES_COUNT_PER_STEP); i++) {
    renderMovie(featureListContainer, allMovies[i]);
  }
}

/**
 * Render Top Rated List Movies
 */

if (topMoviesList.length > 0) {
  const topRatedListContainer = new ExtraListMoviesLayoutView('Top rated');
  render( films, topRatedListContainer, RenderPosition.BEFOREBEGIN );

  for (let i = 0; i < Math.min(topMoviesList.length, MAX_EXTRA_MOVIES); i++) {
    renderMovie(topRatedListContainer.getElement().querySelector('.films-list__container'), topMoviesList[i]);
  }
}

/**
 * Render Most Commented List Movies
 */

if (mostCommentedMoviesList.length > 0) {
  const mostCommentedListContainer = new ExtraListMoviesLayoutView('Most commented');
  render( films, mostCommentedListContainer, RenderPosition.BEFOREBEGIN );
  for (let i = 0; i < Math.min(mostCommentedMoviesList.length, MAX_EXTRA_MOVIES); i++) {
    renderMovie(mostCommentedListContainer.getElement().querySelector('.films-list__container'), mostCommentedMoviesList[i]);
  }
}

/**
 * Show More Button
 */
if (allMovies.length > MOVIES_COUNT_PER_STEP) {
  let renderedMoviesCount = MOVIES_COUNT_PER_STEP;
  const showMore = new ShowMoreButtonView();
  render( featureList, showMore, RenderPosition.BEFOREBEGIN );

  showMore.setClickHandler(() => {
    allMovies
      .slice(renderedMoviesCount, renderedMoviesCount + MOVIES_COUNT_PER_STEP)
      .forEach((movie) =>
        renderMovie(featureListContainer, movie),
      );
    renderedMoviesCount += MOVIES_COUNT_PER_STEP;
    if (renderedMoviesCount > allMovies.length) {
      showMore.getElement().remove();
    }
  });
}

/**
 * Footer Statistic
 */
render( footerStatistics, new FooterStatisticsView(allMovies.length), RenderPosition.BEFOREBEGIN );
