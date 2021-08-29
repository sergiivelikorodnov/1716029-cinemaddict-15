import { generateComments } from './mock/comments.js';
import { generateMovies } from './mock/movie.js';
import { generateFilter } from './utils/filter.js';
import ListMoviesPresenter from './presenter/list-movies-presenter.js';

const COMMENTS_TOTAL_COUNT = 20;
const MOVIES_TOTAL_COUNT = 18;

const allComments = generateComments(COMMENTS_TOTAL_COUNT);
const allMovies = generateMovies(allComments, MOVIES_TOTAL_COUNT);
const filters = generateFilter(allMovies);

const siteMainContainer = document.querySelector('.main');

const moviesPresenter = new ListMoviesPresenter(siteMainContainer);

moviesPresenter.init(allMovies, allComments, filters);
