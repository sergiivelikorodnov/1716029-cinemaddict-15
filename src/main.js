import {
  MOVIES_COUNT_PER_STEP,
  topMoviesList,
  mostCommentedMoviesList
} from './const.js';
import { createFooterStatistics } from './view/footer-statistics.js';
import { createHeaderProfile } from './view/header-profile.js';
import { createSiteMenuFiltersTemplate } from './view/site-menu.js';
import { createSiteSortTemplate } from './view/site-sort.js';
import { createListMoviesLayout } from './view/list-movies-template.js';
import { createShowMoreButton } from './view/show-more-button.js';
import { createFilmCard } from './view//film-card.js';
import { allComments } from './mock/comments.js';
import { allMovies } from './mock/movie.js';
import { generateFilter } from './mock/filter.js';
import { createFilmDetails } from './view/film-details.js';
import { createComment } from './view/film-comment.js';

const filters = generateFilter(allMovies);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector('.main');
const headerProfile = document.querySelector('.header');
const footerStatistics = document.querySelector('.footer');
const body = document.querySelector('body');

render(headerProfile, createHeaderProfile(), 'beforeend');
render(siteMainElement, createSiteMenuFiltersTemplate(filters), 'beforeend');
render(siteMainElement, createSiteSortTemplate(), 'beforeend');
render(
  siteMainElement,
  createListMoviesLayout('Top Rated', 'Most Commented'),
  'beforeend',
);

const featureList = document.querySelector('.films-list');
const featureListContainer = featureList.querySelector(
  '.films-list__container',
);
const extraLists = document.querySelectorAll('.films-list--extra');
const topRatedListContainer = extraLists[0].querySelector(
  '.films-list__container',
);
const mostCommentedListContainer = extraLists[1].querySelector(
  '.films-list__container',
);

/**
 * Featured List Movies
 */
for (let i = 0; i < Math.min(allMovies.length, MOVIES_COUNT_PER_STEP); i++) {
  render(featureListContainer, createFilmCard(allMovies[i]), 'beforeend');
}

/**
 * Render Top Rated List Movies
 */
for (let i = 0; i < Math.min(topMoviesList.length, 2); i++) {
  render(topRatedListContainer, createFilmCard(topMoviesList[i]), 'beforeend');
}

/**
 * Render Most Commented List Movies
 */
for (let i = 0; i < Math.min(mostCommentedMoviesList.length, 2); i++) {
  render(
    mostCommentedListContainer,
    createFilmCard(mostCommentedMoviesList[i]),
    'beforeend',
  );
}

/**
 * Show More Button
 */
if (allMovies.length > MOVIES_COUNT_PER_STEP) {
  let renderedMoviesCount = MOVIES_COUNT_PER_STEP;
  render(featureList, createShowMoreButton(), 'beforeend');
  const showMore = featureList.querySelector('.films-list__show-more');

  showMore.addEventListener('click', (evt) => {
    evt.preventDefault();
    allMovies
      .slice(renderedMoviesCount, renderedMoviesCount + MOVIES_COUNT_PER_STEP)
      .forEach((movie) =>
        render(featureListContainer, createFilmCard(movie), 'beforeend'),
      );
    renderedMoviesCount += MOVIES_COUNT_PER_STEP;
    if (renderedMoviesCount > allMovies.length) {
      showMore.remove();
    }
  });
}

/**
 * Footer Statistic
 */
render(footerStatistics, createFooterStatistics(allMovies.length), 'beforeend');

/**
 * Movie Details
 */
const renderFilmDetails = (someFilm) => {
  const filterComments = (obj, key, value) =>
    obj.filter((v) => v[key] === value);
  let myComment = '';
  someFilm.comments.forEach(
    (index) =>
      (myComment += createComment(filterComments(allComments, 'id', index))),
  );
  render(body, createFilmDetails(someFilm), 'beforeend');

  const filmDetailsCommentList = document.querySelector(
    '.film-details__comments-list',
  );
  render(filmDetailsCommentList, myComment, 'beforeend');

  body.classList.add('hide-overflow');
  const closeButton = document.querySelector('.film-details__close-btn');
  const closeButtonHandler = (evt) => {
    evt.preventDefault();
    const filmNode = document.querySelector('.film-details');
    closeButton.removeEventListener('click', closeButtonHandler);
    body.classList.remove('hide-overflow');
    filmNode.remove();
  };

  closeButton.addEventListener('click', closeButtonHandler);
};

renderFilmDetails(allMovies[0]);
