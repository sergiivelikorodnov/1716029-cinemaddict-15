export const MOVIES_COUNT_PER_STEP = 10;
export const MAX_SHORT_DESCRIPTION_LENGTH = 139;
export const MINUTES_IN_HOUR = 60;
export const MAX_EXTRA_MOVIES = 2;

export const SortType = {
  DEFAULT: 'default',
  BY_DATE: 'by-date',
  BY_RATING: 'by-rating',
};

export const UserAction = {
  UPDATE_MOVIE: 'UPDATE_MOVIE',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

export const StatsFilterType = {
  ALL: 'all-time',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

export const MenuItem = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
  STATISTICS: 'statistics',
};

export const UserRang = {
  NEWBEE: {
    RANG: '',
    WATCHED_MOVIES: 0,
  },
  NOVICE: {
    RANG: 'Novice',
    WATCHED_MOVIES: 11,
  },
  FAN: {
    RANG: 'Fan',
    WATCHED_MOVIES: 21,
  },
  MOVIE_BUFF: {
    RANG: 'Movie buff',
    WATCHED_MOVIES: 22,
  },
};

