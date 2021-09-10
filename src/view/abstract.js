import { createElement } from '../utils/render.js';

const SHAKE_ANIMATION_TIMEOUT = 600;
export default class Abstract {
  constructor() {
    if (new.target === Abstract) {
      throw new Error('Can\'t instantiate Abstract, only concrete one.');
    }
    this._element = null;
    this._callback = {};
  }

  getTemplate() {
    throw new Error('Abstract method not implemented: getTemplate.');
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  shake(callback, commentId) {
    console.log(this.getElement());
    console.log(this.getElement().querySelector(`[data-id="${commentId}"]`));
    console.log(`[data-id="${commentId}"]`);


    this.getElement().querySelector(`[data-id="${commentId}"]`).style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      this.getElement().style.animation = '';
      callback();
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
