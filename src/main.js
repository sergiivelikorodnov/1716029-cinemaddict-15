import { MOVIES_COUNT_PER_STEP } from './const.js';
import { removeComponent, render, RenderPosition } from './utils/render.js';
import { sortTopMoviesList, sortMostCommentedMoviesList } from './utils/sort.js';
import { generateComments } from './mock/comments.js';
import { generateMovies } from './mock/movie.js';
import { generateFilter } from './mock/filter.js';
import FooterStatisticsView from './view/footer-statistics.js';
import HeaderProfileView from './view/header-profile.js';
import SiteMenuView from './view/site-menu.js';
import SiteSortView from './view/site-sort.js';
import ListMoviesView from './view/list-movies.js';
import ListExtraMoviesView from './view/list-extra-movies.js';
import ShowMoreButtonView from './view/show-more-button.js';
import FilmCardView from './view//film-card.js';
import NoFilmView from './view//no-film.js';
import FilmDetailsView from './view/film-details.js';
import FilmCommentView from './view/film-comment.js';

const COMMENTS_TOTAL_COUNT = 20;
const allComments = generateComments(COMMENTS_TOTAL_COUNT);

const MOVIES_TOTAL_COUNT = 18;
const MAX_EXTRA_MOVIES = 2;
const allMovies = generateMovies(allComments, MOVIES_TOTAL_COUNT);

const filters = generateFilter(allMovies);

const headerProfileContainer = document.querySelector('.header');
render(headerProfileContainer, new HeaderProfileView(), RenderPosition.BEFOREBEGIN);

const siteMainContainer = document.querySelector('.main');
const listMoviesElement = new ListMoviesView();
render(siteMainContainer, new SiteMenuView(filters), RenderPosition.BEFOREBEGIN);
render(siteMainContainer, new SiteSortView(), RenderPosition.BEFOREBEGIN);
render( siteMainContainer, listMoviesElement, RenderPosition.BEFOREBEGIN );

/**
 * Movie Details
 */

const renderFilmDetails = (someFilm) => {
  const bodyContainer = document.querySelector('body');
  const renderedMovieContainer = bodyContainer.querySelector('.film-details');
  if (renderedMovieContainer !== null) {
    bodyContainer.removeChild(renderedMovieContainer);
  }

  const openedMovieDetails = new FilmDetailsView(someFilm);
  bodyContainer.appendChild(openedMovieDetails.getElement());

  const filmDetailsCommentList = openedMovieDetails.getElement().querySelector('.film-details__comments-list' );
  const filterComments = (someComments, commentKey, commentValue) => someComments.filter((comment) => comment[commentKey] === commentValue);

  someFilm.comments.forEach((index) =>
    render(filmDetailsCommentList, new FilmCommentView(filterComments(allComments, 'id', index)),  RenderPosition.BEFOREBEGIN ),
  );

  bodyContainer.classList.add('hide-overflow');

  /**
   * Esc button
   */
  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      bodyContainer.classList.remove('hide-overflow');
      removeComponent(openedMovieDetails);
      bodyContainer.removeEventListener('keydown', onEscKeyDown);
    }
  };

  const closeButtonHandler = () => {
    document.removeEventListener('keydown', onEscKeyDown);
    bodyContainer.classList.remove('hide-overflow');
    removeComponent(openedMovieDetails);
  };

  /**
   * Close Listeners
   */
  openedMovieDetails.setClickHandler(closeButtonHandler);
  document.addEventListener('keydown', onEscKeyDown);
};

/**
 * Render Movie
 */
const renderMovie = (movieElement, movie) => {
  const movieComponent = new FilmCardView(movie);
  render(movieElement, movieComponent, RenderPosition.BEFOREBEGIN);

  movieComponent.setClickHandler(() => {
    renderFilmDetails(movie);
  });
};

/**
 * Featured List Movies
 */
const featureListContainer = listMoviesElement.getElement().querySelector('.films-list__container');
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

const topMoviesList = sortTopMoviesList(allMovies);

if (topMoviesList.length > 0) {
  const topRatedListContainer = new ListExtraMoviesView('Top rated');

  render( listMoviesElement, topRatedListContainer, RenderPosition.BEFOREBEGIN );

  for (let i = 0; i < Math.min(topMoviesList.length, MAX_EXTRA_MOVIES); i++) {
    renderMovie(topRatedListContainer.getElement().querySelector('.films-list__container'), topMoviesList[i]);
  }
}

/**
 * Render Most Commented List Movies
 */

const mostCommentedMoviesList = sortMostCommentedMoviesList(allMovies);

if (mostCommentedMoviesList.length > 0) {
  const mostCommentedListContainer = new ListExtraMoviesView('Most commented');

  render( listMoviesElement, mostCommentedListContainer, RenderPosition.BEFOREBEGIN );
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

  const featureList = listMoviesElement.getElement().querySelector('.films-list');
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

const footerStatisticsContainer = document.querySelector('.footer');
render( footerStatisticsContainer, new FooterStatisticsView(allMovies.length), RenderPosition.BEFOREBEGIN );
