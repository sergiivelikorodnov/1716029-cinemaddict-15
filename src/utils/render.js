import Abstract from '../view/abstract';

export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREBEGIN: 'beforebegin',
};

export const render = (container, child, place) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }

  if (child instanceof Abstract) {
    child = child.getElement();
  }

  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(child);
      break;
    case RenderPosition.BEFOREBEGIN:
      container.append(child);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstElementChild;
};

export const removeComponent = (component) => {
  if (!(component instanceof Abstract)) {
    throw new Error('Can remove only components');
  }
  component.getElement().remove();
  component.removeElement();
};
