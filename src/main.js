
import { createFooterStatistics } from './view/footer-statistics.js';
import { createHeaderProfile } from './view/header-profile.js';
import { createSiteMenuTemplate } from './view/site-menu.js';
import { createSiteSortTemplate } from './view/site-sort.js';
import { createListMoviesLayout } from './view/list-movies-template.js';
import { createFilmDetails } from './view/film-details.js';

const render =(container, template, place)=>{
  container.insertAdjacentHTML(place,template);
};

const siteMainElement = document.querySelector('.main');
const headerProfile = document.querySelector('.header');
const footerStatistics = document.querySelector('.footer');
const body = document.querySelector('body');

render(headerProfile, createHeaderProfile(), 'beforeend');
render(siteMainElement, createSiteMenuTemplate(), 'beforeend');
render(siteMainElement, createSiteSortTemplate(), 'beforeend');
render(siteMainElement, createListMoviesLayout('Top rated', 'Most commented'), 'beforeend');

render(footerStatistics, createFooterStatistics(), 'beforeend');
render(body, createFilmDetails(), 'beforeend');
body.classList.add('hide-overflow');
