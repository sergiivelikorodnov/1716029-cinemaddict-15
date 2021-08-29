import { generateComments } from './mock/comments.js';
import { generateMovies } from './mock/movie.js';
import ListMoviesPresenter from './presenter/list-movies-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import Movies from './model/movies.js';
import FiltersModel from './model/filters.js';

const COMMENTS_TOTAL_COUNT = 20;
const MOVIES_TOTAL_COUNT = 18;

const allComments = generateComments(COMMENTS_TOTAL_COUNT);
const allMovies = generateMovies(allComments, MOVIES_TOTAL_COUNT);

const siteMainContainer = document.querySelector('.main');

const moviesModel = new Movies();
moviesModel.setMovies(allMovies);
const filterModel = new FiltersModel();

const moviesPresenter = new ListMoviesPresenter(siteMainContainer, moviesModel, filterModel);

const filterPresenter = new FilterPresenter(siteMainContainer, filterModel, moviesModel);
filterPresenter.init();
moviesPresenter.init(allComments);
