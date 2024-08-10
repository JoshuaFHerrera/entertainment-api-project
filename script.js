// "3cb9ca61"
// POPUPS
function initializePopup(poster, movie) {
  // nodes
  const popupPoster = document.querySelector(".popup-poster");
  const popupPosterImg = document.querySelector(".popup-poster-img");
  // initializing movie attributes
  let movieTitle = movie.Title;
  let movieYear = movie.Year;
  let movieDirectors = movie.Director.split(", ");
  let movieWriters = movie.Writer.split(", ");
  let movieActors = movie.Actors.split(", ");
  let movieGenres = movie.Genre.split(", ");
  let moviePlot = movie.Plot;
  let movieRated = movie.Rated;
  let movieRating = movie.imdbRating;
  let movieRuntime = movie.Runtime;

  // opens and closes popups on click
  poster.addEventListener("click", () => {
    document.body.style.height = "100%";
    document.body.style.overflow = "hidden";
    document.querySelector(".popup").classList.add("active");
    popupPosterImg.src = movie.Poster;
    let ratingP = document.querySelector(".rating-p");
    let ageP = document.querySelector(".age-p");
    let durationP = document.querySelector(".duration-p");
    let title = document.querySelector(".title");
    let year = document.querySelector(".year");
    let directors = document.querySelector(".directors");
    let genres = document.querySelector(".genres");
    let writers = document.querySelector(".writers");
    let actors = document.querySelector(".actors");
    let plot = document.querySelector(".plot");
    title.innerHTML = movieTitle;
    ratingP.innerHTML = movieRating;
    ageP.innerHTML = movieRated;
    durationP.innerHTML = movieRuntime;
    year.innerHTML = movieYear;
    plot.innerHTML = moviePlot;
    while (directors.firstChild) {
      directors.firstChild.remove();
    }
    for (let i = 0; i < movieDirectors.length; i++) {
      let director = document.createElement("li");
      director.textContent = movieDirectors[i];
      director.classList.add("test");
      directors.appendChild(director);
    }
    while (writers.firstChild) {
      writers.firstChild.remove();
    }
    for (let i = 0; i < movieWriters.length; i++) {
      let writer = document.createElement("li");
      writer.textContent = movieWriters[i];
      writers.appendChild(writer);
    }
    while (actors.firstChild) {
      actors.firstChild.remove();
    }
    for (let i = 0; i < movieActors.length; i++) {
      let actor = document.createElement("li");
      actor.textContent = movieActors[i];
      actors.appendChild(actor);
    }
    while (genres.firstChild) {
      genres.firstChild.remove();
    }
    for (let i = 0; i < movieGenres.length; i++) {
      let genre = document.createElement("li");
      genre.textContent = movieGenres[i];
      genres.appendChild(genre);
    }
  });
}
// close popups
function closePopup() {
  document.body.style.height = 0;
  document.body.style.overflow = "visible";
  document.querySelector(".popup").classList.remove("active");
}

// TRENDING MOVIES
// retrieving trending movies and uploading posters
const slidesWrapper = document.getElementById("slides-wrapper");
// fetches trending movies
fetch("https://api.trakt.tv/movies/trending", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "trakt-api-version": 2,
    "trakt-api-key":
      "86d2f5aad5605e99d7c434c59c62e226096a9256730e15c6516f3657988baaa0",
  },
})
  .then((response) => response.json())
  // loads each movie into trending and creates its own popup
  .then((data) => {
    for (let i = 0; i < data.length; i++) {
      let link = `http://www.omdbapi.com/?i=${data[i].movie.ids.imdb}&apikey=3cb9ca61`;
      fetch(link)
        .then((response) => response.json())
        .then((data) => {
          if (data.Poster != "N/A") {
            let poster = document.getElementById(`trending-${i}`);
            poster.src = data.Poster;
            initializePopup(poster, data, "trending");
          }
        });
    }
  });

// POPULAR MOVIES
const popularContainer = document.getElementById("popular-container");
// fetches trending movies
fetch("https://api.trakt.tv/movies/popular", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "trakt-api-version": 2,
    "trakt-api-key":
      "86d2f5aad5605e99d7c434c59c62e226096a9256730e15c6516f3657988baaa0",
  },
})
  .then((response) => response.json())
  // loads each movie into trending and creates its own popup
  .then((data) => {
    console.log(data);
    for (let i = 0; i < data.length; i++) {
      let link = `http://www.omdbapi.com/?i=${data[i].ids.imdb}&apikey=3cb9ca61`;
      fetch(link)
        .then((response) => response.json())
        .then((data) => {
          if (data.Poster != "N/A") {
            let poster = document.getElementById(`popular-${i}`);
            poster.src = data.Poster;
            initializePopup(poster, data);
          }
        });
    }
  });
