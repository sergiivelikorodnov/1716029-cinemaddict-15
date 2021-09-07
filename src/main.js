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

const AUTHORIZATION = 'Basic 3232xx2';
const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict';

const api = new Api(END_POINT, AUTHORIZATION);

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
  api,
);


const filterPresenter = new FilterPresenter(
  siteMenuComponent,
  filterModel,
  moviesModel,
);

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.ALL:
      moviesPresenter.hideMoviesList();
      remove(statisticsComponent);
      moviesPresenter.init();
      break;
    case MenuItem.WATCHLIST:
      moviesPresenter.hideMoviesList();
      remove(statisticsComponent);
      moviesPresenter.init();
      break;
    case MenuItem.HISTORY:
      moviesPresenter.hideMoviesList();
      remove(statisticsComponent);
      moviesPresenter.init();
      break;
    case MenuItem.FAVORITES:
      moviesPresenter.hideMoviesList();
      remove(statisticsComponent);
      moviesPresenter.init();
      break;
    case MenuItem.STATISTICS:
      moviesPresenter.hideMoviesList();
      statisticsComponent = new StatisticsView(moviesModel.getMovies());
      render(siteMainContainer, statisticsComponent);
      break;
  }
};

filterPresenter.init();
moviesPresenter.init();

api.getMovies()
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

