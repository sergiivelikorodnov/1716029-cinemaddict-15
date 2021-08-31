import AbstractObserver from '../utils/abstract-observer';

export default class Comments extends AbstractObserver {
  constructor() {
    super();
    this._comments = [];
  }

  setComments(comments) {
    this._comments = comments.slice();
  }

  getComments() {
    return this._comments;
  }

  addComment(updateType, update, comment) {
    this._comments = [comment, ...this._comments];

    this._notify(updateType, update);
  }

  deleteComment(updateType, commentId) {
    this._comments = this._comments.filter(
      (comment) => comment.id !== commentId,
    );
    this._notify(updateType);
  }
}
