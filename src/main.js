import { generateComments } from './mock/comments.js';
import { generateMovies } from './mock/movie.js';
import ListMoviesPresenter from './presenter/list-movies-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import Movies from './model/movies.js';
import FiltersModel from './model/filters.js';
import Comments from './model/comments.js';
import { MenuItem } from './const.js';
import SiteMenuView from './view/site-menu.js';
import StatisticsView from './view/statistics.js';
import { remove, render, RenderPosition } from './utils/render.js';
import Api from './api/api.js';

const COMMENTS_TOTAL_COUNT = 20;
const MOVIES_TOTAL_COUNT = 18;

const AUTHORIZATION = 'Basic sdsacascasa3csacsacas';
const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict';

const api = new Api(END_POINT, AUTHORIZATION);

api.getMovies().then((movies) => {
  console.log(movies);
  // Есть проблема: cтруктура объекта похожа, но некоторые ключи называются иначе,
  // а ещё на сервере используется snake_case, а у нас camelCase.
  // Можно, конечно, переписать часть нашего клиентского приложения, но зачем?
  // Есть вариант получше - паттерн "Адаптер"
});

api.getMovies().then((movies) => console.log(movies));

const allComments = generateComments(COMMENTS_TOTAL_COUNT);
const allMovies = generateMovies(allComments, MOVIES_TOTAL_COUNT);

const siteMainContainer = document.querySelector('.main');

const commentsModel = new Comments();
commentsModel.setComments(allComments);

const moviesModel = new Movies();
moviesModel.setMovies(allMovies);

const filterModel = new FiltersModel();

const moviesPresenter = new ListMoviesPresenter(
  siteMainContainer,
  moviesModel,
  filterModel,
  commentsModel,
);


const siteMenuComponent = new SiteMenuView();
render(siteMainContainer, siteMenuComponent, RenderPosition.AFTERBEGIN);

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
siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
filterPresenter.init();
moviesPresenter.init();

// render(siteMainContainer, new StatisticsView(moviesModel.getMovies()));

