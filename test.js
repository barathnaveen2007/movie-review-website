const axios = require("axios");
require("dotenv").config();

const API_KEY = process.env.TMDB_API_KEY;

axios.get("https://api.themoviedb.org/3/search/movie", {
    params: {
        api_key: API_KEY,
        query: "avatar"
    }
})
.then(response => {
    console.log("SUCCESS");
    console.log(response.data);
})
.catch(error => {
    console.log("ERROR");

    if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
    } else {
        console.log(error.message);
    }
});