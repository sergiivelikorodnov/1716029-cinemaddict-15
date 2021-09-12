import ListMoviesPresenter from './presenter/list-movies-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import MoviesModel from './model/movies.js';
import FiltersModel from './model/filters.js';
import CommentsModel from './model/comments.js';
import { MenuItem, UpdateType } from './const.js';
import SiteMenuView from './view/site-menu.js';
import StatisticsView from './view/statistics.js';
import { remove, render, RenderPosition } from './utils/render.js';
import Api from './api/api.js';
import Store from './api/store.js';
import Provider from './api/provider.js';

const AUTHORIZATION = 'Basic 3232xx2';
const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict';
const STORE_PREFIX = 'cinema-localstorage';
const STORE_VER = 'v15';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const siteMainContainer = document.querySelector('.main');

const commentsModel = new CommentsModel();

const moviesModel = new MoviesModel();
const siteMenuComponent = new SiteMenuView();

const filterModel = new FiltersModel();

const moviesPresenter = new ListMoviesPresenter(
  siteMainContainer,
  moviesModel,
  filterModel,
  commentsModel,
  apiWithProvider,
);


const filterPresenter = new FilterPresenter(
  siteMenuComponent,
  filterModel,
  moviesModel,
);

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  if (menuItem !== MenuItem.STATISTICS) {
    moviesPresenter.hideMoviesList();
    remove(statisticsComponent);
    moviesPresenter.init();
  } else {
    moviesPresenter.hideMoviesList();
    statisticsComponent = new StatisticsView(moviesModel.getMovies());
    render(siteMainContainer, statisticsComponent);
  }
};

filterPresenter.init();
moviesPresenter.init();

apiWithProvider.getMovies()
  .then((movies) => {
    moviesModel.setMovies(UpdateType.INIT, movies);
    render(siteMainContainer, siteMenuComponent, RenderPosition.AFTERBEGIN);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  })
  .catch(() => {
    moviesModel.setMovies(UpdateType.INIT, []);
    render(siteMainContainer, siteMenuComponent, RenderPosition.AFTERBEGIN);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  });

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  apiWithProvider.sync();
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
});
