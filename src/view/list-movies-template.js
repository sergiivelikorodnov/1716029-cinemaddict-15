const createListMoviesLayout =(title1, title2)=>(
  `<section class="films">
    <section class="films-list">
     <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
     <div class="films-list__container">

     </div>
    </section>
    <section class="films-list films-list--extra">
      <h2 class="films-list__title">${title1}</h2>
      <div class="films-list__container">

      </div>
    </section>
    <section class="films-list films-list--extra">
      <h2 class="films-list__title">${title2}</h2>
      <div class="films-list__container">

      </div>
    </section>
  </section>`
);

export {createListMoviesLayout};
