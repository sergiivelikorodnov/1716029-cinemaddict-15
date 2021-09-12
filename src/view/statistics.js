import {Chart} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { StatsFilterType } from '../const.js';
import { minutesToHours } from '../utils/common.js';
import { calcPopularGenres, userRang, watchedMoviesByDateRange } from '../utils/statistics.js';
import Smart from './smart.js';

const createStatsFilters = (filter, currentFilterType) => {

  const { type, name} = filter;
  return  `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${type}" value="${type}" ${currentFilterType === type ? 'checked' : ''}>
    <label for="statistic-${type}" class="statistic__filters-label">${name}</label>`;
};


const createStatsFilterTemplate = (statsFilterItems, currentFilterType) => {
  const statsFilters = statsFilterItems
    .map((filter) => createStatsFilters(filter, currentFilterType))
    .join('');

  return (`<form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
    <p class="statistic__filters-description">Show stats:</p>
    ${statsFilters}
  </form>`);
};

const createChart = (statisticCtx, state, currentFilterType) => {
  const BAR_HEIGHT = 50;
  const { movies } = state;
  const filteredMovies = watchedMoviesByDateRange(movies, currentFilterType);
  const topGenres = calcPopularGenres(filteredMovies);

  statisticCtx.height = BAR_HEIGHT * Object.keys(topGenres).length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: Object.keys(topGenres),
      datasets: [{
        data: Object.values(topGenres),
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 24,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatsLayout = (state, currentFilterType) => {
  const { movies } = state;
  const filteredMovies = watchedMoviesByDateRange(movies, currentFilterType);
  const topGenres = Object.keys(calcPopularGenres(filteredMovies))[0];

  const watchedStats = filteredMovies.length;
  const watchedTimeStats = minutesToHours(filteredMovies);

  const createStatsRank = () =>(
    `<p class="statistic__rank">
    Your rank
    <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    <span class="statistic__rank-label">${userRang(watchedStats)}</span>
  </p>`);

  const filters = [
    {
      type: StatsFilterType.ALL,
      name: 'All time',
    },
    {
      type: StatsFilterType.TODAY,
      name: 'Today',
    },
    {
      type: StatsFilterType.WEEK,
      name: 'Week',
    },
    {
      type: StatsFilterType.MONTH,
      name: 'Month',
    },
    {
      type: StatsFilterType.YEAR,
      name: 'Year',
    },
  ];


  return (
    `<section class="statistic">
    ${createStatsRank()}
    ${createStatsFilterTemplate(filters, currentFilterType)}

  <ul class="statistic__text-list">
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">You watched</h4>
      <p class="statistic__item-text">${watchedStats} <span class="statistic__item-description">${watchedStats < 2 ? 'movie': 'movies'}</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Total duration</h4>
      <p class="statistic__item-text">${watchedTimeStats.hours} <span class="statistic__item-description">h</span> ${watchedTimeStats.minutes} <span class="statistic__item-description">m</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text">${topGenres === undefined? '': topGenres}</p>
    </li>
  </ul>

  <div class="statistic__chart-wrap">
    <canvas class="statistic__chart" width="1000"></canvas>
  </div>

</section>`
  );
};

export default class ListMovieLayout extends Smart {
  constructor(movies) {
    super();

    this.state = {
      movies,
    };
    this._currentFilterType = StatsFilterType.ALL;
    this._filterChooseHandler = this._filterChooseHandler.bind(this);
    this._setChart();
    this._setInnerHandlers();
  }

  getTemplate() {
    return createStatsLayout(this.state, this._currentFilterType );
  }


  restoreHandlers() {
    this._setInnerHandlers();
    this._setChart();
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.statistic__filters')
      .addEventListener('click', this._filterChooseHandler);
  }

  _filterChooseHandler(evt) {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    evt.preventDefault();
    this._currentFilterType = evt.target.value;

    this.updateState({});
  }

  _setChart() {
    if (this._genresCharts !== null) {
      this._genresCharts = null;
    }
    const statisticCtx = this.getElement().querySelector('.statistic__chart');
    this._genresCharts = createChart(statisticCtx, this.state, this._currentFilterType);
  }
}
