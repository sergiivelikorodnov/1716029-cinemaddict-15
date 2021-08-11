import {
  MOVIES_COUNT_PER_STEP,
  topMoviesList,
  mostCommentedMoviesList
} from './const.js';
import FooterStatisticsView from './view/footer-statistics.js';
import { render, RenderPosition } from './utils.js';
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

render(
  headerProfile,
  new HeaderProfileView().getElement(),
  RenderPosition.BEFOREBEGIN,
);
render(
  siteMainElement,
  new SiteMenuFiltersTemplateView(filters).getElement(),
  RenderPosition.BEFOREBEGIN,
);
render(
  siteMainElement,
  new SiteSortTemplateView().getElement(),
  RenderPosition.BEFOREBEGIN,
);
render(
  siteMainElement,
  films.getElement(),
  RenderPosition.BEFOREBEGIN,
);

/**
 * Movie Details
 */
let isOpen;
let currentMovie;
const renderFilmDetails = (someFilm) => {
  if (!isOpen) {
    currentMovie = new FilmDetailsView(someFilm).getElement();
    body.appendChild(currentMovie);
    isOpen = true;
  } else {
    const newMovie = new FilmDetailsView(someFilm).getElement();
    body.replaceChild(newMovie, currentMovie);
    currentMovie = newMovie;
  }

  const filmDetailsCommentList = currentMovie.querySelector(
    '.film-details__comments-list',
  );
  const filterComments = (obj, key, value) =>
    obj.filter((v) => v[key] === value);
  someFilm.comments.forEach((index) =>
    render(
      filmDetailsCommentList,
      new CommentView(filterComments(allComments, 'id', index)).getElement(),
      RenderPosition.BEFOREBEGIN,
    ),
  );

  body.classList.add('hide-overflow');
  const closeButton = document.querySelector('.film-details__close-btn');
  const closeButtonHandler = (evt) => {
    evt.preventDefault();
    closeButton.removeEventListener('click', closeButtonHandler);
    body.classList.remove('hide-overflow');
    isOpen = false;
    body.removeChild(currentMovie);
  };

  /**
   * Esc button
   */
  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      body.classList.remove('hide-overflow');
      isOpen = false;
      body.removeChild(currentMovie);
      body.removeEventListener('keydown', onEscKeyDown);
      closeButton.removeEventListener('click', closeButtonHandler);
    }
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
  render(movieElement, movieComponent.getElement(), RenderPosition.BEFOREBEGIN);

  [
    movieComponent.getElement().querySelector('.film-card__poster'),
    movieComponent.getElement().querySelector('.film-card__title'),
    movieComponent.getElement().querySelector('.film-card__comments'),
  ].forEach((linkTarget) =>
    linkTarget.addEventListener('click', () => {
      renderFilmDetails(movie);
    }),
  );
};

/**
 * Featured List Movies
 */
if (allMovies.length === 0) {
  render(
    featureListContainer,
    new NoFilmView().getElement(),
    RenderPosition.BEFOREBEGIN,
  );
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
  render(
    films.getElement(),
    topRatedListContainer.getElement(),
    RenderPosition.BEFOREBEGIN,
  );

  for (let i = 0; i < Math.min(topMoviesList.length, 2); i++) {
    renderMovie(topRatedListContainer.getElement().querySelector('.films-list__container'), topMoviesList[i]);
  }
}

/**
 * Render Most Commented List Movies
 */

if (mostCommentedMoviesList.length > 0) {
  const mostCommentedListContainer = new ExtraListMoviesLayoutView('Most commented');
  render(
    films.getElement(),
    mostCommentedListContainer.getElement(),
    RenderPosition.BEFOREBEGIN,
  );
  for (let i = 0; i < Math.min(mostCommentedMoviesList.length, 2); i++) {
    renderMovie(mostCommentedListContainer.getElement().querySelector('.films-list__container'), mostCommentedMoviesList[i]);
  }
}

/**
 * Show More Button
 */
if (allMovies.length > MOVIES_COUNT_PER_STEP) {
  let renderedMoviesCount = MOVIES_COUNT_PER_STEP;
  const showMore = new ShowMoreButtonView();
  render(
    featureList,
    showMore.getElement(),
    RenderPosition.BEFOREBEGIN,
  );
  const showMoreButton = showMore.getElement();

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    allMovies
      .slice(renderedMoviesCount, renderedMoviesCount + MOVIES_COUNT_PER_STEP)
      .forEach((movie) =>
        render(
          featureListContainer,
          new FilmCardView(movie).getElement(),
          RenderPosition.BEFOREBEGIN,
        ),
      );
    renderedMoviesCount += MOVIES_COUNT_PER_STEP;
    if (renderedMoviesCount > allMovies.length) {
      showMoreButton.remove();
    }
  });
}

/**
 * Footer Statistic
 */
render(
  footerStatistics,
  new FooterStatisticsView(allMovies.length).getElement(),
  RenderPosition.BEFOREBEGIN,
);
