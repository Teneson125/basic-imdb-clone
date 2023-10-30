const imageNotAvailable = "public/assert/images/image-not-available.png";

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  const apiKey = "da538c04";
  searchInput.addEventListener("input", async function () {
    //getting the input from the user.
    const data = await fetch(
      `https://www.omdbapi.com/?s=${searchInput.value}&page=1&apikey=${apiKey}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.Search) {
          console.log(data.Search);
          displayMovie(data.Search);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  });
});

async function displayMovie(movies) {
  console.log("movies");
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
    var image = "";
    if (movie.Poster !== "N/A") {
      image = movie.Poster;
    } else {
      image = imageNotAvailable;
    }
    movieItem.innerHTML = `
      <img src="${image}" alt="${movie.Title} Poster">
      <div class="flex justify-between">
        <h2 class="font-bold text-xl">${movie.Title}</h2>
        <i class="fas fa-heart text-red-500 mt-[6px] cursor-pointer"></i>
      </div>
      <div class="flex flex-row justify-between">
        <p>${movie.Year}</p>
        <p>Type: ${movie.Type}</p>
      </div>
    `;
    movieList.appendChild(movieItem);
  });
}
