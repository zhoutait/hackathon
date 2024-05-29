document
  .getElementById("myMovieSearch")
  .addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      resetPagination();
      var myInput = document.getElementById("myMovieSearch").value;
      getThisMovie(myInput, 1);
    }
  });

document.getElementById("prev").addEventListener("click", function () {
  let currentPage = parseInt(document.getElementById("current").innerText);
  if (currentPage > 1) {
    currentPage--;
    updatePage(currentPage);
  }
});

document.getElementById("next").addEventListener("click", function () {
  let currentPage = parseInt(document.getElementById("current").innerText);
  currentPage++;
  updatePage(currentPage);
});

function updatePage(page) {
  document.getElementById("current").innerText = page;
  var myInput = document.getElementById("myMovieSearch").value;
  if (myInput && currentCategory === "search") {
    getThisMovie(myInput, page);
  } else if (currentCategory === "random") {
    getRandomMovie(page);
  } else if (currentCategory === "top") {
    getTopMovie(page);
  } else if (currentCategory === "latest") {
    getLatestMovie(page);
  } else if (currentCategory === "upcoming") {
    getUpcomingMovie(page);
  }
}

function resetPagination() {
  document.getElementById("current").innerText = 1;
}

let currentCategory = "random";

document.getElementById("discover").addEventListener("click", function () {
  resetPagination();
  getRandomMovie(1);
});

document.getElementById("top-rated").addEventListener("click", function () {
  resetPagination();
  getTopMovie(1);
});

document.getElementById("newest").addEventListener("click", function () {
  resetPagination();
  getLatestMovie(1);
});

document.getElementById("upcoming").addEventListener("click", function () {
  resetPagination();
  getUpcomingMovie(1);
});

function getThisMovie(q, page) {
  currentCategory = "search";
  const theURL = `https://api.themoviedb.org/3/search/movie?query=${q}&include_adult=false&language=en-US&page=${page}&sort_by=vote_average.desc`;
  fetchMovies(theURL);
}

function getRandomMovie(page) {
  currentCategory = "random";
  const theURL = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc`;
  fetchMovies(theURL);
}

function getTopMovie(page = 1) {
  currentCategory = "top";
  const theURL = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=vote_average.desc&without_genres=99,10755&vote_count.gte=200`;
  fetchMovies(theURL);
}

function getLatestMovie(page = 1) {
  currentCategory = "latest";
  const theURL = `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${page}`;
  fetchMovies(theURL);
}

function getUpcomingMovie(page = 1) {
  currentCategory = "upcoming";
  const theURL = `https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=${page}`;
  fetchMovies(theURL);
}

function fetchMovies(url) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NTgyMTlhYjMyZTFjNjk0NzE0ZTc4NzgxN2FiOGQ5MiIsInN1YiI6IjY2NTY2NzNkOTI2MWRhNTkzYTE5ZGU0YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Z9v82T_2bMEZeKhwg-u5XcStvMdAmvV_x8eZgR0YCK4",
    },
  };

  fetch(url, options)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then((res) => {
      document.getElementById("myDiv").innerHTML = "";
      if (res.results && res.results.length > 0) {
        res.results.map((mappedDataRes) => {
          var myImage = mappedDataRes.poster_path;
          var myTitle = mappedDataRes.title;
          var myVote = mappedDataRes.vote_average;

          document.getElementById(
            "myDiv"
          ).innerHTML += `<div class="movieHolder">
            <img src="https://image.tmdb.org/t/p/original/${myImage}" alt="">
            <h4>${myTitle}</h4>
            <span>${myVote}</span>
          </div>`;
        });
      } else {
        document.getElementById("myDiv").innerHTML = "<p>No results found.</p>";
      }
    })
    .catch((error) => {
      console.error("Error fetching movies:", error);
      document.getElementById("myDiv").innerHTML =
        "<p>Failed to load movies. Please try again later.</p>";
    });
}
