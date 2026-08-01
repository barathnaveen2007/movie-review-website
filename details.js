const movieDetails = document.getElementById("movieDetails");
const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");

function formatRating(value) {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
        return "N/A";
    }
    return Number(value).toFixed(1);
}

function showError(message) {
    movieDetails.innerHTML = `
        <h2 class="message">${message}</h2>
        <a href="home.html" class="back-link">Back to home</a>
    `;
}

if (!movieId) {
    showError("No movie selected");
} else {
    loadMovieDetails(movieId);
}

async function loadMovieDetails(id) {
    try {
        const response = await fetch(`/movie/${id}`);

        let movie;
        try {
            movie = await response.json();
        } catch {
            throw new Error("Server returned an invalid response.");
        }

        if (!response.ok) {
            throw new Error(movie.error || "Failed to load movie");
        }

        const poster = movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "https://via.placeholder.com/300x450?text=No+Image";

        const genres = Array.isArray(movie.genres)
            ? movie.genres.map((genre) => genre.name).join(", ")
            : "Unknown";

        const cast = movie.credits?.cast
            ?.slice(0, 5)
            .map((actor) => actor.name)
            .join(", ") || "Not available";

        document.title = `${movie.title || "Movie"} - Movie Review`;

        movieDetails.innerHTML = `
            <a href="home.html" class="back-link">← Back to home</a>

            <div class="details-card">
                <img src="${poster}" alt="${movie.title || "Movie"}">

                <div class="details-info">
                    <h2>${movie.title || "Untitled"}</h2>
                    <p><strong>Rating:</strong> ${formatRating(movie.vote_average)} / 10</p>
                    <p><strong>Release Date:</strong> ${movie.release_date || "Unknown"}</p>
                    <p><strong>Runtime:</strong> ${movie.runtime ? movie.runtime + " min" : "Unknown"}</p>
                    <p><strong>Genres:</strong> ${genres}</p>
                    <p><strong>Cast:</strong> ${cast}</p>
                    <h3>Overview</h3>
                    <p class="overview">${movie.overview || "No overview available."}</p>
                </div>
            </div>
        `;

    } catch (error) {
        console.error(error);

        if (error.message.includes("Failed to fetch") || error.name === "TypeError") {
            showError("Cannot connect to server. Run node server.js in the api folder, then open http://localhost:3000");
            return;
        }

        showError(error.message || "Something went wrong!");
    }
}
