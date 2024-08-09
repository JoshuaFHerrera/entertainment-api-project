// "3cb9ca61"
// initialize movie categories
let trendingMovieData = [];

// POPUPS
let firstPopup = true;
function initializePopup(poster, index) {
  // nodes
  const popupPoster = document.querySelector(".popup-poster");
  const rating = document.querySelector(".rating");
  const ageRating = document.querySelector(".age-rating");
  const duration = document.querySelector(".duration");
  // initializing movie attributes
  let title = poster.title;
  console.log(poster.title);
  // opens and closes popups on click
  poster.addEventListener("click", () => {
    document.querySelector(".popup").classList.add("active");
    if (firstPopup) {
      // add content if no content exists
      poster.id = "popup-poster";
      popupPoster.appendChild(poster);
      firstPopup = false;
    } else {
      // update existing content
      let currentPoster = document.getElementById("popup-poster");
      let ratingImg = document.querySelector(".rating-p");
      let ageImg = document.querySelector(".age-p");
      let duraitonImg = document.querySelector(".duration-p");
      currentPoster.src = poster.src;
    }
  });
}
// close popups
function closePopup() {
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
    console.log(data);
    for (let i = 0; i < data.length; i++) {
      let poster = document.createElement("img");
      let link = `http://www.omdbapi.com/?i=${data[i].movie.ids.imdb}&apikey=3cb9ca61`;
      fetch(link)
        .then((response) => response.json())
        .then((data) => {
          trendingMovieData[i] = data;
          if (data.Poster != "N/A") {
            let posterSrc = data.Poster;
            poster.src = posterSrc;
            initializePopup(poster, i);
            slidesWrapper.appendChild(poster);
          }
        });
    }
  });
