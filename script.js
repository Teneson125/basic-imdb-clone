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
            updateSuggestionList(data);
            displayMovie(data.Search);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    });

    //close the suggestionsList if we focusout from the search input
    searchInput.addEventListener("focusout", () => {
      setTimeout(() => {
        document.getElementById("suggestionsList").innerHTML = "";
      }, 300);
    });
  }

  const favoriteMovieList = document.getElementById("favoriteMovieList");
  if (favoriteMovieList) {
    const favoriteMovieMessage = document.getElementById(
      "favoriteMovieMessage"
    );
    // Retrieve the list of favorite movies from local storage
    const favoriteMovies = JSON.parse(localStorage.getItem("favoriteMovies"));
    if (Array.isArray(favoriteMovies) && favoriteMovies.length > 0) {
      displayFavoriteMovies(favoriteMovies);
    } else {
      favoriteMovieMessage.innerHTML = `
      No favorite movies added yet.
      `;
    }
  }

  const movieDetails = document.getElementById("movieDetails");
  if (movieDetails) {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    getMovieDetails(id);
  }
});

//update the input value from the suggestionsList
function changeInputValue(input) {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.value = input;
    //update the home page for the new input
    fetch(`https://www.omdbapi.com/?s=${input}&page=1&apikey=${apiKey}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.Search) {
          displayMovie(data.Search);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  document.getElementById("suggestionsList").innerHTML = "";
}

//update the suggestionsList for each input
function updateSuggestionList(data) {
  const suggestionsList = document.getElementById("suggestionsList");
  suggestionsList.innerHTML = `
          
${data.Search.map((val, index) => {
  return `
    <div key="${index}">
      <li class="p-[10px] hover:bg-[#d7d7d7]" onClick="changeInputValue('${val.Title}')">${val.Title}</li>
    </div>
  `;
})}
`;
}

//get the movie details and for the detailed movie page.
async function getMovieDetails(id) {
  //get the movie by the id
  fetch(`https://www.omdbapi.com/?i=${id}&apikey=${apiKey}`)
    .then((res) => res.json())
    .then((data) => displayMovieDetails(data))
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

//This function is used to display the individual movie details.
async function displayMovieDetails(data) {
  const isFavoriteIcon = await isFavorite(data.imdbID);
  const movieDetails = document.getElementById("movieDetails");
  const movieDetailMessage = document.getElementById("movieDetailMessage");

  movieDetailMessage.innerHTML = `
  <p class="flex flex-row gap-1">
    <span>Showing result for</span>
    <span class="font-bold">${data.Title}</span>
  </p>
  `;

  movieDetails.id = data.imdbID;
  var image = "";
  if (data.Poster !== "N/A") {
    image = data.Poster;
  } else {
    image = imageNotAvailable;
  }

  const icon = isFavoriteIcon
    ? '<i class="fas fa-heart"></i>'
    : '<i class="far fa-heart"></i>';
  // add the movie details to the movie.html page by the id.
  movieDetails.innerHTML = `
    <div class="flex flex-col gap-3 w-full">
      <div class="flex items-center justify-between">
        <div class="flex gap-5">
          <h1 class="font-bold text-3xl">${data.Title}</h1>
        </div>
        <div class="text-red-500 cursor-pointer" onclick="toggleFavorite('${
          data.imdbID
        }')">
          ${icon}
        </div>
      </div>
      <div class="flex items-center justify-between">
        <div class="flex gap-5">
          <p>${data.Year}</p>        
          <p>${data.Runtime}</p>
          <p>${data.Language}</p>
        </div>
        <div class="flex">
          <div class="flex gap-1">
            <p>Rating:</p>
            <p>${data.imdbRating}/10</p>
          </div>
        </div>
      </div>
      <div class="flex flex-col md:flex-row gap-10">
        <img src="${image}" alt="${data.Title} Poster">
        <div class="flex justify-between flex-col gap-5">
          <div class="flex flex-col gap-5">
          <div class="flex flex-row gap-3">
          ${data.Genre.split(",")
            .map((genre, index) => {
              const trimmedGenre = genre.trim();
              if (trimmedGenre) {
                return `
                <div key="${index}" class="flex justify-center items-center px-[16px] py-[4px] rounded-[30px] bg-white text-black">
                  ${trimmedGenre}
                </div>
              `;
              }
              return "";
            })
            .join("")}
          </div>
        
            <p>${data.Plot}</p>
          </div>
          <div class="flex flex-col gap-5">
            <p class="flex gap-1">
              <span class="font-bold">Director:</span>
              <span>${data.Director}</span>
            </p>
            <p class="flex gap-1">
              <span class="font-bold">Writer:</span>
              <span>${data.Writer}</span>
            </p>
            <p class="flex gap-1">
              <span class="font-bold">Actors:</span>
              <span>${data.Actors}</span>
            </p>
            <p class="flex gap-1">
              <span class="font-bold">Released:</span>
              <span>${data.Released}</span>
            </p>
            <p class="flex gap-1">
              <span class="font-bold">Type:</span>
              <span>${data.Type}</span>
            </p>
          </div>
        </div>
      </div>
      
    </div>

  `;
}

async function displayFavoriteMovies(favoriteMovies) {
  // Retrieve and display a list of favorite movies with poster, title, year, and a favorite icon.
  const favoriteMovieList = document.getElementById("favoriteMovieList");
  const favoriteMovieMessage = document.getElementById("favoriteMovieMessage");
  favoriteMovieList.innerHTML = "";
  favoriteMovieMessage.innerHTML = `
      There are ${favoriteMovies.length} favourite movies.
      `;
  favoriteMovies.forEach(async (movie) => {
    const isFavoriteIcon = await isFavorite(movie.imdbID);
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

    const icon = isFavoriteIcon
      ? '<i class="fas fa-heart"></i>'
      : '<i class="far fa-heart"></i>';

    movieItem.innerHTML = `
          <img src="${image}" alt="${movie.Title} Poster">
          <div class="flex justify-between">
            <a href="movie.html?id=${movie.imdbID}" >
              <h2 class="font-bold text-xl">${movie.Title}</h2>
            </a>
            <div class="mt-[6px] text-red-500 cursor-pointer" onclick="toggleFavorite('${movie.imdbID}')">
               ${icon}
            </div>
          </div>
          <div class="flex flex-row justify-between">
            <p>${movie.Year}</p>
            <p>Type: ${movie.Type}</p>
          </div>
        `;
    favoriteMovieList.appendChild(movieItem);
  });
}

async function displayMovie(movies) {
  // Display a list of movie search results with poster, title, year, and a favorite icon.
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
        <a href="movie.html?id=${movie.imdbID}" >
          <h2 class="font-bold text-xl">${movie.Title}</h2>
        </a>
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
  // Toggle a movie as a favorite or remove it from favorites, and update the UI accordingly.
  const movie = favoriteMovies.find((m) => m.imdbID === imdbID);

  if (movie) {
    removeFromFavorites(movie);
    const favoriteMovieList = document.getElementById("favoriteMovieList");
    if (favoriteMovieList) {
      const storedFavoriteMovies = JSON.parse(
        localStorage.getItem("favoriteMovies")
      );
      if (Array.isArray(storedFavoriteMovies)) {
        favoriteMovies = storedFavoriteMovies;
      }

      displayFavoriteMovies(favoriteMovies);
      return;
    }

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
  // Check if a movie is in the list of favorite movies.
  return favoriteMovies.some((m) => m.imdbID === imdbID);
}
