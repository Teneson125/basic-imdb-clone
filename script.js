const imageNotAvailable = "public/assert/images/image-not-available.png";
let favoriteMovies = [];
const apiKey = "da538c04";

// Retrieve the list of favorite movies from local storage
const storedFavoriteMovies = JSON.parse(localStorage.getItem("favoriteMovies"));
if (Array.isArray(storedFavoriteMovies)) {
  favoriteMovies = storedFavoriteMovies;
}

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", async function () {
      //getting the input from the user.
      const data = await fetch(
        `https://www.omdbapi.com/?s=${searchInput.value}&page=1&apikey=${apiKey}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data && data.Search) {
            displayMovie(data.Search);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    });
  }

  const favoriteMovieList = document.getElementById("favoriteMovieList");
  if (favoriteMovieList) {
    // Retrieve the list of favorite movies from local storage
    const favoriteMovies = JSON.parse(localStorage.getItem("favoriteMovies"));
    if (Array.isArray(favoriteMovies) && favoriteMovies.length > 0) {
      // displayFavoriteMovies(favoriteMovies);
      window.alert(favoriteMovies.length);
    } else {
      favoriteMovieList.innerHTML = "<p>No favorite movies added yet.</p>";
    }
  }
});

async function displayMovie(movies) {
  const movieList = document.getElementById("movieList");
  movieList.innerHTML = ""; // Clear previous results

  movies.forEach((movie) => {
    const movieItem = document.createElement("div");
    movieItem.classList.add(
      "flex",
      "flex-col",
      "gap-5",
      "p-[10px]",
      "bg-white"
    );
    movieItem.id = movie.imdbID;
    var image = "";
    if (movie.Poster !== "N/A") {
      image = movie.Poster;
    } else {
      image = imageNotAvailable;
    }

    const icon = isFavorite(movie.imdbID)
      ? '<i class="fas fa-heart"></i>'
      : '<i class="far fa-heart"></i>';

    movieItem.innerHTML = `
      <img src="${image}" alt="${movie.Title} Poster">
      <div class="flex justify-between">
        <h2 class="font-bold text-xl">${movie.Title}</h2>
        <div class="mt-[6px] text-red-500 cursor-pointer" onclick="toggleFavorite('${movie.imdbID}')">
           ${icon}
        </div>
      </div>
      <div class="flex flex-row justify-between">
        <p>${movie.Year}</p>
        <p>Type: ${movie.Type}</p>
      </div>
    `;
    movieList.appendChild(movieItem);
  });
}

// Function to toggle a movie as a favorite or remove it from favorites
async function toggleFavorite(imdbID) {
  const movie = favoriteMovies.find((m) => m.imdbID === imdbID);

  if (movie) {
    removeFromFavorites(movie);
    const movieItem = document.getElementById(imdbID);
    if (movieItem) {
      const icon = '<i class="far fa-heart"></i>';
      const iconContainer = movieItem.querySelector(".text-red-500");
      if (iconContainer) {
        iconContainer.innerHTML = icon;
      }
    }
  } else {
    fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`)
      .then((res) => res.json())
      .then((movieDetails) => {
        if (movieDetails && movieDetails.Response === "True") {
          addToFavorites(movieDetails);
          const movieItem = document.getElementById(imdbID);
          if (movieItem) {
            const icon = '<i class="fas fa-heart"></i>';
            const iconContainer = movieItem.querySelector(".text-red-500");
            if (iconContainer) {
              iconContainer.innerHTML = icon;
            }
          }
        } else {
          console.error("Movie not found");
        }
      })
      .catch((error) => {
        console.error("Error adding to favorites:", error);
      });
  }
}

// Function to add a movie to favorites
function addToFavorites(movie) {
  favoriteMovies.push(movie);
  // Save the updated list of favorite movies in local storage
  localStorage.setItem("favoriteMovies", JSON.stringify(favoriteMovies));
}

// Function to remove a movie from favorites
function removeFromFavorites(movie) {
  favoriteMovies = favoriteMovies.filter((m) => m.imdbID !== movie.imdbID);
  // Save the updated list of favorite movies in local storage
  localStorage.setItem("favoriteMovies", JSON.stringify(favoriteMovies));
}

// Function to check if a movie is already in favorites
function isFavorite(imdbID) {
  return favoriteMovies.some((m) => m.imdbID === imdbID);
}
