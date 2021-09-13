import { humanTime, timeConvertor } from '../utils/common.js';
import he from 'he';
import Smart from './smart.js';

const EMOJI = ['smile', 'sleeping', 'puke', 'angry'];

const DELETE = {
  DELETE: 'Delete',
  DELETING: 'Deleting...',
};

const createEmojiTemplate = (choosedDataEmoji, isDisabled) =>
  EMOJI
    .map(
      (
        emotion,
      ) => `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emotion}" value="${emotion}"
      ${emotion === choosedDataEmoji ? 'checked' : '' } ${isDisabled ? 'disabled' : ''}>
    <label class="film-details__emoji-label" for="emoji-${emotion}">
      <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji">
    </label>`,
    )
    .join('');

const createCommentTemplate = (allComments, isDisabled, isDeleting) =>
  allComments
    .map(
      ({
        id,
        author,
        comment,
        emotion,
        date,
      }) => `<li class="film-details__comment" data-id="${id}">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
    </span>
    <div>
      <p class="film-details__comment-text">${he.encode(comment)}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${humanTime(date)}</span>
        <button class="film-details__comment-delete" data-id="${id}" ${isDisabled ? 'disabled' : ''}>${isDeleting ? `${ DELETE.DELETING }` : `${ DELETE.DELETE }`}</button>
      </p>
    </div>
  </li>`,
    )
    .join('');

const createFilmDetails = (data) => {
  const {
    title,
    alternativeTitle,
    ageRating,
    poster,
    totalRating,
    date,
    country,
    writers,
    actors,
    director,
    runTime,
    genres,
    description,
    isAlreadyWatched,
    isFavorite,
    isWatchList,
    isComments,
    emojiData,
    commentData,
    isDisabled,
    isDeleting,
  } = data;

  const emojiTemplate = createEmojiTemplate(emojiData);
  const commentsTemplate = createCommentTemplate(isComments, isDisabled, isDeleting);
  const commentsNumber = isComments.length;
  const runTimeMins = timeConvertor(runTime);

  const alreadyWatchedActive = isAlreadyWatched
    ? 'film-details__control-button--active'
    : '';
  const watchListActive = isWatchList
    ? 'film-details__control-button--active'
    : '';
  const favoritedActive = isFavorite
    ? 'film-details__control-button--active'
    : '';

  const renderGenre = (arr) => {
    let text = '';
    arr.forEach(
      (name) => (text += `<span class="film-details__genre">${name}</span>`),
    );
    return text;
  };

  const genreTitle = genres.length === 1 ? 'Genre' : 'Genres';

  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="">

          <p class="film-details__age">${ageRating}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">${alternativeTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${totalRating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${date}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${runTimeMins}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${genreTitle}</td>
              <td class="film-details__cell">
              ${renderGenre(genres)}
            </tr>
          </table>

          <p class="film-details__film-description">
          ${description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <button type="button" class="film-details__control-button film-details__control-button--watchlist ${watchListActive}" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button film-details__control-button--watched ${alreadyWatchedActive}" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite ${favoritedActive}" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsNumber}</span></h3>

        <ul class="film-details__comments-list">
          ${commentsTemplate}
        </ul>

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">
          ${
  emojiData
    ? `<img src="images/emoji/${emojiData}.png" width="55" height="55" alt="emoji-${emojiData}"></img>`
    : ''
}
          </div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${isDisabled ? 'disabled' : ''}>${ commentData ? `${commentData}` : ''}</textarea>
          </label>

          <div class="film-details__emoji-list ${isDisabled ? 'disabled' : ''}">
            ${emojiTemplate}
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`;
};

export default class FilmDetails extends Smart {
  constructor(movie, comments) {
    super();
    this._data = FilmDetails.parseMovieToData(movie, comments);

    this._closeFilmDetailsPopupHandler = this._closeFilmDetailsPopupHandler.bind(this);
    this._addToWatchlistHandler = this._addToWatchlistHandler.bind(this);
    this._markAsWatchedHandler = this._markAsWatchedHandler.bind(this);
    this._addFavoriteHandler = this._addFavoriteHandler.bind(this);
    this._deleteCommentHandler = this._deleteCommentHandler.bind(this);
    this._emojiChooseHandler = this._emojiChooseHandler.bind(this);
    this._commentInputTextHandler = this._commentInputTextHandler.bind(this);
    this._submitNewCommentHandler = this._submitNewCommentHandler.bind(this);
    this._setInnerHandlers();
  }

  getTemplate() {
    return createFilmDetails(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setCloseFilmDetailsPopupHandler(this._callback.closeFilmDetailsPopup);
    this.setAddToWatchlistHandler(this._callback.addToWatchlistClick);
    this.setMarkAsWatchedHandler(this._callback.markAsWatchedClick);
    this.setAddFavoriteHandler(this._callback.addFavoriteClick);
    this.setDeleteCommentHandler(this._callback.deleteCommentClick);
    this.setCommentSubmitHandler(this._callback.commentSubmit);
  }

  setCloseFilmDetailsPopupHandler(callback) {
    this._callback.closeFilmDetailsPopup = callback;
    this.getElement()
      .querySelector('.film-details__close-btn')
      .addEventListener('click', this._closeFilmDetailsPopupHandler);
  }

  setAddToWatchlistHandler(callback) {
    this._callback.addToWatchlistClick = callback;
    this.getElement()
      .querySelector('.film-details__control-button--watchlist')
      .addEventListener('click', this._addToWatchlistHandler);
  }

  setMarkAsWatchedHandler(callback) {
    this._callback.markAsWatchedClick = callback;
    this.getElement()
      .querySelector('.film-details__control-button--watched')
      .addEventListener('click', this._markAsWatchedHandler);
  }

  setAddFavoriteHandler(callback) {
    this._callback.addFavoriteClick = callback;
    this.getElement()
      .querySelector('.film-details__control-button--favorite')
      .addEventListener('click', this._addFavoriteHandler);
  }

  setDeleteCommentHandler(callback) {
    this._callback.deleteCommentClick = callback;
    const commentsElement = this.getElement().querySelectorAll(
      '.film-details__comment',
    );
    commentsElement.forEach((element) => {
      element
        .querySelector('.film-details__comment-delete')
        .addEventListener('click', this._deleteCommentClickHandler);
    });
  }

  setCommentSubmitHandler(callback) {
    this._callback.commentSubmit = callback;
    document.addEventListener('keydown', this._submitNewCommentHandler);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelectorAll('.film-details__emoji-item')
      .forEach((emojiItem) =>
        emojiItem.addEventListener('click', this._emojiChooseHandler),
      );
    this.getElement()
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this._commentInputTextHandler);
    this.getElement()
      .querySelectorAll('.film-details__comment-delete')
      .forEach((deleteComment) =>
        deleteComment.addEventListener('click', this._deleteCommentHandler),
      );
  }

  _emojiChooseHandler(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    this.updateState({
      emojiData: evt.target.value,
    });
  }

  _commentInputTextHandler(evt) {
    evt.preventDefault();
    this.updateState(
      {
        commentData: evt.target.value,
      },
      true,
    );
  }

  _submitNewCommentHandler(evt) {
    if (evt.key === 'Enter' && (evt.metaKey || evt.ctrlKey)) {

      evt.preventDefault();

      const newComment = {
        emotion: this._data.emojiData,
        comment: this._data.commentData,
      };

      if (newComment.emotion === undefined || newComment.comment === undefined || newComment.emotion === null || newComment.comment === null) {
        return;
      }
      newComment.date = new Date;
      this._callback.commentSubmit(FilmDetails.parseDataToMovie(newComment));

      this._data.emojiData = null;
      this._data.commentData = null;

    }
  }

  _deleteCommentHandler(evt) {
    evt.preventDefault();

    this._callback.deleteCommentClick(evt.target.dataset.id);
  }

  _closeFilmDetailsPopupHandler(evt) {
    evt.preventDefault();
    this._callback.closeFilmDetailsPopup();
  }

  _addToWatchlistHandler(evt) {
    evt.preventDefault();
    this._callback.addToWatchlistClick();

    this.updateState(
      {
        isWatchList: !this._data.isWatchList,
      },
      true,
    );
  }

  _markAsWatchedHandler(evt) {
    evt.preventDefault();
    this._callback.markAsWatchedClick();

    this.updateState({
      isAlreadyWatched: !this._data.isAlreadyWatched,
    });
  }

  _addFavoriteHandler(evt) {
    evt.preventDefault();
    this._callback.addFavoriteClick();

    this.updateState(
      {
        isFavorite: !this._data.isFavorite,
      },
      true,
    );
  }

  static parseMovieToData(movie, comments) {
    delete movie.isComments;

    return Object.assign(
      {},
      movie,
      {
        isComments: comments.getComments(),
        isDeleting: false,
        isDisabled:false,
      },
    );

  }

  static parseDataToMovie(data) {
    data = Object.assign({}, data);

    delete data.emojiData;
    delete data.commentData;
    delete data.isComments;
    delete data.isDisabled;
    delete data.isDeleting;

    return data;
  }
}
