import { createFilmCard } from './film-card.js';

const createMovies =(value)=>{
  let filmList;
  for (let i = 1; i <= value; i++) {
    const film = createFilmCard();
    filmList = film+filmList;
  }
  return filmList;
};

export {createMovies};
