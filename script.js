const searchBtn = document.getElementById("searchBtn");
const movieInput = document.getElementById("movieInput");
const movieContainer = document.getElementById("movies");

searchBtn.addEventListener("click", searchMovie);
movieInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        searchMovie();
    }
});

function formatRating(value) {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
        return "N/A";
    }
    return Number(value).toFixed(1);
}

function showError(message) {
    movieContainer.innerHTML = `<h2 class="message">${message}</h2>`;
}
async function loadPopularMovies() {
    try {
        const response = await fetch("/popular");
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error);
        }

        movieContainer.innerHTML = data.results.map(movie => {

            const poster = movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "https://via.placeholder.com/300x450?text=No+Image";
        
            return `
                <a href="movie.html?id=${movie.id}" class="movie-card">
                    <img src="${poster}" alt="${movie.title}">
                    <div class="movie-info">
                        <h3>${movie.title}</h3>
                        <p><strong>Rating:</strong> ${formatRating(movie.vote_average)}</p>
                        <p><strong>Release:</strong> ${movie.release_date || "Unknown"}</p>
                    </div>
                </a>
            `;
        
        }).join("");

    } catch (error) {
        console.error(error);
        showError("Failed to load popular movies.");
    }
}

async function searchMovie() {
    const movieName = movieInput.value.trim();

    if (movieName === "") {
        alert("Please enter a movie name");
        return;
    }

    movieContainer.innerHTML = "<h2 class='loading'>Loading...</h2>";

    try {
        const response = await fetch(`/search?q=${encodeURIComponent(movieName)}`);

        let data;
        try {
            data = await response.json();
        } catch {
            throw new Error("Server returned an invalid response.");
        }

        if (!response.ok) {
            throw new Error(data.error || "Search failed");
        }

        if (!Array.isArray(data.results) || data.results.length === 0) {
            showError("Movie Not Found");
            return;
        }
         window.location.href=`search.html?q=${encodeURIComponent(movieName)}`;


    } catch (error) {
        console.error(error);

        if (error.message.includes("Failed to fetch") || error.name === "TypeError") {
            showError("Cannot connect to server. Run <code>node server.js</code> in the api folder, then open http://localhost:3000");
            return;
        }

        showError(error.message || "Something went wrong!");
    }
}
loadPopularMovies();