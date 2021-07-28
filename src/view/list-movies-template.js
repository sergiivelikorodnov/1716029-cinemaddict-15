import { createShowMoreButton } from './show-more-button.js';
import { createMovies } from './movies-list.js';

export const createListMoviesLayout =(title1, title2)=>(
  `<section class="films">
    <section class="films-list">
     <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
     <div class="films-list__container">
      ${createMovies(5)}
     </div>
    ${createShowMoreButton()}
    </section>
    <section class="films-list films-list--extra">
      <h2 class="films-list__title">${title1}</h2>
      <div class="films-list__container">
      ${createMovies(2)}
      </div>
    </section>
    <section class="films-list films-list--extra">
      <h2 class="films-list__title">${title2}</h2>
      <div class="films-list__container">
      ${createMovies(2)}
      </div>
    </section>
  </section>`
);
