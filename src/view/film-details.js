import { timeConvertor } from '../utils/common.js';
import AbstractView from './abstract.js';

const createFilmDetails = (movie, comments) => {

  const createCommentTemplate = (allComments) =>Object.values(allComments).map(({id, author, comment, emotion, date}) => `<li class="film-details__comment" id="${id}">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
    </span>
    <div>
      <p class="film-details__comment-text">${comment}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${date}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`).join('');


  const {
    title,
    alternativeTitle,
    ageRating,
    poster,
    totalRating,
    release,
    writers,
    actors,
    director,
    runTime,
    genres,
    description,
  } = movie.filmInfo;

  const {
    alreadyWatched,
    favorite,
    watchList,
  } = movie.userDetails;

  const alreadyWatchedActive = alreadyWatched ? 'film-details__control-button--active' : '';
  const favoritedActive = favorite ? 'film-details__control-button--active' : '';
  const watchListActive = watchList ? 'film-details__control-button--active' : '';

  const commentsTemplate = createCommentTemplate(comments);
  // console.log(commentsTemplate);


  const commentsNumber = movie.comments.size;
  const runTimeMins = timeConvertor(runTime);
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
              <td class="film-details__cell">${release.date}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${runTimeMins}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${release.country}</td>
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
          <div class="film-details__add-emoji-label"></div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`;
};

export default class FilmDetails extends AbstractView {
  constructor(movie, comments) {
    super();
    this._movie = movie;
    this._comments = comments;
    this._closeFilmDetailsPopupHandler = this._closeFilmDetailsPopupHandler.bind(this);
    this._addToWatchlistHandler = this._addToWatchlistHandler.bind(this);
    this._markAsWatchedHandler = this._markAsWatchedHandler.bind(this);
    this._addFavoriteHandler = this._addFavoriteHandler.bind(this);
  }

  getTemplate() {
    return createFilmDetails(this._movie, this._comments);
  }

  _closeFilmDetailsPopupHandler(evt) {
    evt.preventDefault();
    this._callback.closeFilmDetailsPopup();
  }

  _addToWatchlistHandler(evt) {
    evt.preventDefault();
    this._callback.addToWatchlist();
  }

  _markAsWatchedHandler(evt) {
    evt.preventDefault();
    this._callback.markAsWatchedHandler();
  }

  _addFavoriteHandler(evt) {
    evt.preventDefault();
    this._callback.addFavoriteHandler();
  }

  setCloseFilmDetailsPopupHandler(callback) {
    this._callback.closeFilmDetailsPopup = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._closeFilmDetailsPopupHandler);
  }

  setAddToWatchlistHandler(callback) {
    this._callback.addToWatchlist = callback;
    this.getElement().querySelector('.film-details__control-button--watchlist').addEventListener('click', this._addToWatchlistHandler);
  }

  setMarkAsWatchedHandler(callback) {
    this._callback.markAsWatchedHandler = callback;
    this.getElement().querySelector('.film-details__control-button--watched').addEventListener('click', this._markAsWatchedHandler);
  }

  setAddFavoriteHandler(callback) {
    this._callback.addFavoriteHandler = callback;
    this.getElement().querySelector('.film-details__control-button--favorite').addEventListener('click', this._addFavoriteHandler);
  }
}
