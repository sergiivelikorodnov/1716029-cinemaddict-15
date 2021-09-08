import AbstractObserver from '../utils/abstract-observer';

export default class Comments extends AbstractObserver {
  constructor() {
    super();
    this._comments = [];
  }

  setComments(updateType, comments) {
    this._comments = comments.slice();
    this._notify(updateType);
  }

  getComments() {
    return this._comments;
  }

  addComment(updateType, update, comments) {
    this._comments = comments;
    this._notify(updateType, update);
  }

  deleteComment(updateType, commentId) {
    this._comments = this._comments.filter(
      (comment) => comment.id !== commentId,
    );
    this._notify(updateType);
  }

  static adaptToClient(comment) {
    const adaptedComment = Object.assign(
      {},
      comment,
      {
        emotion: comment.emotion,
      },
    );
    return adaptedComment;
  }

  static adaptToServer(comment) {
    const adaptedComment = Object.assign(
      {},
      comment,
      {
        emotion: comment.emotion,
      },
    );
    return adaptedComment;
  }
}
