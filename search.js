console.log("seach.js loaded");
const movieContainer = document.getElementById("movies");

const params = new URLSearchParams(window.location.search);
const query = params.get("q");

function formatRating(value) {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
        return "N/A";
    }
    return Number(value).toFixed(1);
}

function showError(message) {
    movieContainer.innerHTML = `<h2 class="message">${message}</h2>`;
}

async function loadSearchResults() {

    if (!query) {
        showError("No search query found.");
        return;
    }

    try {

        const response = await fetch(`/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Search failed");
        }

        if (!data.results || data.results.length === 0) {
            showError("No movies found.");
            return;
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
        showError("Something went wrong.");
    }
}

loadSearchResults();