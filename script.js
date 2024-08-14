// POPUPS
function initializePopup(poster, movie, category) {
  // intitialize movie title and score
  let movieTitle = movie.original_title;
  let movieScore = movie.vote_average.toFixed(1);

  // extract movie release date
  let movieRelease = "";
  let year = movie.release_date.substring(0, 4);
  let month = movie.release_date.substring(5, 7);
  let day = movie.release_date.substring(8, 10);
  // month
  if (month == "01") {
    movieRelease += "January";
  } else if (month == "02") {
    movieRelease += "February";
  } else if (month == "03") {
    movieRelease += "March";
  } else if (month == "04") {
    movieRelease += "April";
  } else if (month == "05") {
    movieRelease += "May";
  } else if (month == "06") {
    movieRelease += "June";
  } else if (month == "07") {
    movieRelease += "July";
  } else if (month == "08") {
    movieRelease += "August";
  } else if (month == "09") {
    movieRelease += "September";
  } else if (month == "10") {
    movieRelease += "October";
  } else if (month == "11") {
    movieRelease += "November";
  } else {
    movieRelease += "December, ";
  }
  movieRelease += "&nbsp;";
  // day
  if (day == "01") {
    movieRelease += "1, ";
  } else if (day == "02") {
    movieRelease += "2, ";
  } else if (day == "03") {
    movieRelease += "3, ";
  } else if (day == "04") {
    movieRelease += "4, ";
  } else if (day == "05") {
    movieRelease += "5, ";
  } else if (day == "06") {
    movieRelease += "6, ";
  } else if (day == "07") {
    movieRelease += "7, ";
  } else if (day == "08") {
    movieRelease += "8, ";
  } else if (day == "09") {
    movieRelease += "9, ";
  } else {
    movieRelease += day + ", ";
  }
  // year
  movieRelease += "&nbsp;" + year;

  // extract genres
  let movieGenres = [];
  for (let i = 0; i < movie.genres.length; i++) {
    movieGenres.push(movie.genres[i].name);
  }

  // extract plots
  let moviePlot = movie.overview;

  // extract rating
  // checks if US rating exists
  let ratingFound = false;
  let movieRated = "";
  for (let i = 0; i < movie.release_dates.results.length; i++) {
    if (
      movie.release_dates.results[i].iso_3166_1 == "US" &&
      movie.release_dates.results[i].release_dates[0].certification != ""
    ) {
      movieRated =
        movie.release_dates.results[i].release_dates[0].certification;
      ratingFound = true;
    }
  }
  // replace with other regional rating
  if (!ratingFound) {
    for (let i = 0; i < movie.release_dates.results.length; i++) {
      if (movie.release_dates.results[i].release_dates[0].certification != "") {
        movieRated =
          movie.release_dates.results[i].release_dates[0].certification +
          "&nbsp;(" +
          movie.release_dates.results[i].iso_3166_1 +
          ")";
        ratingFound = true;
      }
    }
  }

  fetch(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=ffab15fe77996e2456606092407c3b5a&language=en-US&
`)
    .then((response) => response.json())
    .then((data) => {
      // get directors, writers and actors
      // directors
      let movieDirectors = [];
      let movieWriters = [];
      let movieActors = [];

      let crewCounter = 0;
      let index = 0;
      while (crewCounter < 3 && index < data.crew.length) {
        if (data.crew[index].job == "Director") {
          movieDirectors.push(data.crew[index].original_name);
          crewCounter++;
        }
        index++;
      }
      // writers
      crewCounter = 0;
      index = 0;
      while (crewCounter < 3 && index < data.crew.length) {
        if (
          data.crew[index].job == "Writer" ||
          data.crew[index].job == "Screenplay"
        ) {
          movieWriters.push(data.crew[index].original_name);
          crewCounter++;
        }
        index++;
      }
      // cast
      for (let i = 0; i < 3; i++) {
        movieActors.push(data.cast[i].original_name);
      }

      // extract runtime
      let movieRuntime = movie.runtime + "&nbsp;min";

      // opens and closes popups on click
      poster.addEventListener("click", () => {
        // retrieve nodes
        const popupPoster = document.querySelector(".popup-poster");
        const popupPosterImg = document.querySelector(".popup-poster-img");
        // activates popup
        document.body.style.height = "100%";
        document.body.style.overflow = "hidden";
        document.querySelector(".popup").classList.add("active");
        document.querySelector(".nav").classList.add("hidden");
        popupPosterImg.src = `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`;
        // retrieve placeholders
        let scoreP = document.querySelector(".score-p");
        let ageP = document.querySelector(".age-p");
        let durationP = document.querySelector(".duration-p");
        let title = document.querySelector(".title");
        let release = document.querySelector(".release");
        let directors = document.querySelector(".directors");
        let genres = document.querySelector(".genres");
        let writers = document.querySelector(".writers");
        let actors = document.querySelector(".actors");
        let plot = document.querySelector(".plot");

        // replace placeholders with extracted data (if variable is empty, leave "N/A")
        if (movieTitle == "") {
          title.innerHTML = "N/A";
        } else {
          title.innerHTML = movieTitle;
        }
        if (movieScore == "") {
          scoreP.innerHTML = "N/A";
        } else {
          scoreP.innerHTML = movieScore;
        }
        if (movieRated == "") {
          ageP.innerHTML = "N/A";
        } else {
          ageP.innerHTML = movieRated;
        }
        if (movieRuntime == "") {
          durationP.innerHTML = "N/A";
        } else {
          durationP.innerHTML = movieRuntime;
        }
        if (movieRelease == "") {
          release.innerHTML = "N/A";
        } else {
          release.innerHTML = movieRelease;
        }
        if (moviePlot == "") {
          plot.innerHTML = "N/A";
        } else {
          plot.innerHTML = moviePlot;
        }

        // remove crew elements to be replaced
        while (directors.firstChild) {
          directors.firstChild.remove();
        }
        while (writers.firstChild) {
          writers.firstChild.remove();
        }
        while (actors.firstChild) {
          actors.firstChild.remove();
        }
        while (genres.firstChild) {
          genres.firstChild.remove();
        }

        // create and appened new crew elements
        for (let i = 0; i < movieDirectors.length; i++) {
          let director = document.createElement("li");
          if (movieDirectors.length == 0) {
            director.textContent = "N/A";
          } else {
            director.textContent = movieDirectors[i];
          }
          director.classList.add("test");
          directors.appendChild(director);
        }
        for (let i = 0; i < movieWriters.length; i++) {
          let writer = document.createElement("li");
          if (movieWriters.length == 0) {
            writer.textContent = "N/A";
          } else {
            writer.textContent = movieWriters[i];
          }
          writers.appendChild(writer);
        }
        for (let i = 0; i < movieActors.length; i++) {
          let actor = document.createElement("li");
          if (movieActors.length == 0) {
            actors.textContent = "N/A";
          } else {
            actor.textContent = movieActors[i];
          }
          actors.appendChild(actor);
        }
        for (let i = 0; i < movieGenres.length; i++) {
          let genre = document.createElement("li");
          if (movieGenres.length == 0) {
            genre.textContent = "N/A";
          } else {
            genre.textContent = movieGenres[i];
          }
          genres.appendChild(genre);
        }
      });
    });
}
// close popups
function closePopup() {
  document.body.style.height = 0;
  document.body.style.overflow = "visible";
  document.querySelector(".popup").classList.remove("active");
  document.querySelector(".nav").classList.remove("hidden");
}
// SIDEBAR
// open sidebar
function openSidebar() {
  let sidebar = document.getElementById("sidebar");
  sidebar.classList.add("active");
}
// close sidebar
function closeSidebar() {
  let sidebar = document.getElementById("sidebar");
  sidebar.classList.remove("active");
}

// TRENDING MOVIES
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
      let link = `https://api.themoviedb.org/3/movie/${data[i].movie.ids.tmdb}?api_key=ffab15fe77996e2456606092407c3b5a&language=en-US&&append_to_response=release_dates`;
      fetch(link)
        .then((response) => response.json())
        .then((data) => {
          let poster = document.getElementById(`trending-${i}`);
          poster.src = `https://image.tmdb.org/t/p/original/${data.poster_path}`;
          initializePopup(poster, data, "trending");
        });
    }
  });

// POPULAR MOVIES
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
  .then((data) => {
    for (let i = 0; i < data.length; i++) {
      let link = `https://api.themoviedb.org/3/movie/${data[i].ids.tmdb}?api_key=ffab15fe77996e2456606092407c3b5a&language=en-US&append_to_response=release_dates`;
      fetch(link)
        .then((response) => response.json())
        .then((data) => {
          let poster = document.getElementById(`popular-${i}`);
          if (data.poster_path != null) {
            poster.src = `https://image.tmdb.org/t/p/original/${data.poster_path}`;
            initializePopup(poster, data);
          } else {
            let container = document.getElementById("popular-container");
            container.removeChild(poster);
          }
        });
    }
  });

// FAVORITED MOVIES
fetch("https://api.trakt.tv/movies/favorited/weekly", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "trakt-api-version": 2,
    "trakt-api-key":
      "86d2f5aad5605e99d7c434c59c62e226096a9256730e15c6516f3657988baaa0",
  },
})
  .then((response) => response.json())
  .then((data) => {
    for (let i = 0; i < data.length; i++) {
      let link = `https://api.themoviedb.org/3/movie/${data[i].movie.ids.tmdb}?api_key=ffab15fe77996e2456606092407c3b5a&language=en-US&append_to_response=release_dates`;
      fetch(link)
        .then((response) => response.json())
        .then((data) => {
          let poster = document.getElementById(`favorited-${i}`);
          if (data.poster_path != null) {
            poster.src = `https://image.tmdb.org/t/p/original/${data.poster_path}`;
            initializePopup(poster, data);
          } else {
            let container = document.getElementById("favorited-container");
            container.removeChild(poster);
          }
        });
    }
  });

// HIGHLY ANTICIPATED MOVIES
fetch("https://api.trakt.tv/movies/anticipated", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "trakt-api-version": 2,
    "trakt-api-key":
      "86d2f5aad5605e99d7c434c59c62e226096a9256730e15c6516f3657988baaa0",
  },
})
  .then((response) => response.json())
  .then((data) => {
    for (let i = 0; i < data.length; i++) {
      let link = `https://api.themoviedb.org/3/movie/${data[i].movie.ids.tmdb}?api_key=ffab15fe77996e2456606092407c3b5a&language=en-US&append_to_response=release_dates`;
      fetch(link)
        .then((response) => response.json())
        .then((data) => {
          let poster = document.getElementById(`anticipated-${i}`);
          if (data.poster_path != null) {
            poster.src = `https://image.tmdb.org/t/p/original/${data.poster_path}`;
            initializePopup(poster, data);
          } else {
            let container = document.getElementById("anticipated-container");
            container.removeChild(poster);
          }
        });
    }
  });

// ACTION MOVIES
fetch("https://api.trakt.tv/lists/22484357/items", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "trakt-api-version": 2,
    "trakt-api-key":
      "86d2f5aad5605e99d7c434c59c62e226096a9256730e15c6516f3657988baaa0",
  },
})
  .then((response) => response.json())
  .then((data) => {
    for (let i = 0; i < 10; i++) {
      let link = `https://api.themoviedb.org/3/movie/${
        data[Math.floor(Math.random() * data.length)].movie.ids.tmdb
      }?api_key=ffab15fe77996e2456606092407c3b5a&language=en-US&append_to_response=release_dates
`;
      fetch(link)
        .then((response) => response.json())
        .then((data) => {
          let poster = document.getElementById(`action-${i}`);
          if (data.poster_path != null) {
            poster.src = `https://image.tmdb.org/t/p/original/${data.poster_path}`;
            initializePopup(poster, data);
          } else {
            let container = document.getElementById("action-container");
            container.removeChild(poster);
          }
        });
    }
  });

// ADVENTURE
fetch("https://api.trakt.tv/lists/22032399/items", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "trakt-api-version": 2,
    "trakt-api-key":
      "86d2f5aad5605e99d7c434c59c62e226096a9256730e15c6516f3657988baaa0",
  },
})
  .then((response) => response.json())
  .then((data) => {
    for (let i = 0; i < 10; i++) {
      let link = `https://api.themoviedb.org/3/movie/${
        data[Math.floor(Math.random() * data.length)].movie.ids.tmdb
      }?api_key=ffab15fe77996e2456606092407c3b5a&language=en-US&append_to_response=release_dates`;
      fetch(link)
        .then((response) => response.json())
        .then((data) => {
          let poster = document.getElementById(`adventure-${i}`);
          if (data.poster_path != null) {
            poster.src = `https://image.tmdb.org/t/p/original/${data.poster_path}`;
            initializePopup(poster, data);
          } else {
            let container = document.getElementById("adventure-container");
            container.removeChild(poster);
          }
        });
    }
  });

// ANIMATION
fetch("https://api.trakt.tv/lists/24718087/items", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "trakt-api-version": 2,
    "trakt-api-key":
      "86d2f5aad5605e99d7c434c59c62e226096a9256730e15c6516f3657988baaa0",
  },
})
  .then((response) => response.json())
  .then((data) => {
    for (let i = 0; i < 10; i++) {
      let link = `https://api.themoviedb.org/3/movie/${
        data[Math.floor(Math.random() * data.length)].movie.ids.tmdb
      }?api_key=ffab15fe77996e2456606092407c3b5a&language=en-US&append_to_response=release_dates`;
      fetch(link)
        .then((response) => response.json())
        .then((data) => {
          let poster = document.getElementById(`animation-${i}`);
          if (data.poster_path != null) {
            poster.src = `https://image.tmdb.org/t/p/original/${data.poster_path}`;
            initializePopup(poster, data);
          } else {
            let container = document.getElementById("animation-container");
            container.removeChild(poster);
          }
        });
    }
  });

// DOCUMENTARIES
fetch("https://api.trakt.tv/lists/23587844/items", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "trakt-api-version": 2,
    "trakt-api-key":
      "86d2f5aad5605e99d7c434c59c62e226096a9256730e15c6516f3657988baaa0",
  },
})
  .then((response) => response.json())
  .then((data) => {
    for (let i = 0; i < 10; i++) {
      let link = `https://api.themoviedb.org/3/movie/${
        data[Math.floor(Math.random() * data.length)].movie.ids.tmdb
      }?api_key=ffab15fe77996e2456606092407c3b5a&language=en-US&append_to_response=release_dates`;
      fetch(link)
        .then((response) => response.json())
        .then((data) => {
          let poster = document.getElementById(`documentary-${i}`);
          if (data.poster_path != null) {
            poster.src = `https://image.tmdb.org/t/p/original/${data.poster_path}`;
            initializePopup(poster, data);
          } else {
            let container = document.getElementById("documentary-container");
            container.removeChild(poster);
          }
        });
    }
  });

// COMEDY MOVIES
fetch("https://api.trakt.tv/lists/24751039/items", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "trakt-api-version": 2,
    "trakt-api-key":
      "86d2f5aad5605e99d7c434c59c62e226096a9256730e15c6516f3657988baaa0",
  },
})
  .then((response) => response.json())
  .then((data) => {
    for (let i = 0; i < 10; i++) {
      let link = `https://api.themoviedb.org/3/movie/${
        data[Math.floor(Math.random() * data.length)].movie.ids.tmdb
      }?api_key=ffab15fe77996e2456606092407c3b5a&language=en-US&append_to_response=release_dates`;
      fetch(link)
        .then((response) => response.json())
        .then((data) => {
          let poster = document.getElementById(`comedy-${i}`);
          if (data.poster_path != null) {
            poster.src = `https://image.tmdb.org/t/p/original/${data.poster_path}`;
            initializePopup(poster, data);
          } else {
            let container = document.getElementById("comedy-container");
            container.removeChild(poster);
          }
        });
    }
  });

// ROMANCE MOVIES
fetch("https://api.trakt.tv/lists/24264940/items", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "trakt-api-version": 2,
    "trakt-api-key":
      "86d2f5aad5605e99d7c434c59c62e226096a9256730e15c6516f3657988baaa0",
  },
})
  .then((response) => response.json())
  .then((data) => {
    for (let i = 0; i < 10; i++) {
      let link = `https://api.themoviedb.org/3/movie/${
        data[Math.floor(Math.random() * data.length)].movie.ids.tmdb
      }?api_key=ffab15fe77996e2456606092407c3b5a&language=en-US&append_to_response=release_dates`;
      fetch(link)
        .then((response) => response.json())
        .then((data) => {
          let poster = document.getElementById(`romance-${i}`);
          if (data.poster_path != null) {
            poster.src = `https://image.tmdb.org/t/p/original/${data.poster_path}`;
            initializePopup(poster, data);
          } else {
            let container = document.getElementById("romance-container");
            container.removeChild(poster);
          }
        });
    }
  });

// WESTERN MOVIES
fetch("https://api.trakt.tv/lists/6436692/items", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "trakt-api-version": 2,
    "trakt-api-key":
      "86d2f5aad5605e99d7c434c59c62e226096a9256730e15c6516f3657988baaa0",
  },
})
  .then((response) => response.json())
  .then((data) => {
    for (let i = 0; i < 10; i++) {
      let link = `https://api.themoviedb.org/3/movie/${
        data[Math.floor(Math.random() * data.length)].movie.ids.tmdb
      }?api_key=ffab15fe77996e2456606092407c3b5a&language=en-US&append_to_response=release_dates`;
      fetch(link)
        .then((response) => response.json())
        .then((data) => {
          let poster = document.getElementById(`western-${i}`);
          if (data.poster_path != null) {
            poster.src = `https://image.tmdb.org/t/p/original/${data.poster_path}`;
            initializePopup(poster, data);
          } else {
            let container = document.getElementById("western-container");
            container.removeChild(poster);
          }
        });
    }
  });
