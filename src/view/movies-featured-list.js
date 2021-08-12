import { createFilmCard } from './film-card.js';
import { generateMovie } from '../mock/movie.js';

const MOVIES_COUNT=18;
const featuredMovies = new Array(MOVIES_COUNT).fill().map(generateMovie);


const createFeaturedMovies =(moviesList)=>{
  let film;
  for (let i = 1; i <= moviesList.length; i++) {
    film = createFilmCard((moviesList[i]));
  }
  return film;
};

createFeaturedMovies(featuredMovies);

export {createFeaturedMovies};
