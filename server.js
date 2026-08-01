const db = require("./database/database");
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = 3000;
const API_KEY = process.env.TMDB_API_KEY;

const CLIENT_DIR = path.join(__dirname, "../client");

app.use(cors());
app.use(express.json());
app.use(express.static(CLIENT_DIR));

app.get("/", (req, res) => {
    res.sendFile(path.join(CLIENT_DIR, "index.html"));
});

if (!API_KEY) {
    console.error("ERROR: TMDB_API_KEY is missing in api/.env");
    process.exit(1);
}

app.get("/search", async (req, res) => {
    try {
        const query = req.query.q;

        if (!query || !query.trim()) {
            return res.status(400).json({ error: "Search query is required" });
        }

        const response = await axios.get("https://api.themoviedb.org/3/search/movie", {
            params: {
                api_key: API_KEY,
                query: query.trim()
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error("Search error:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to search movies" });
    }
});

app.get("/movie/:id", async (req, res) => {
    try {
        const movieId = req.params.id;

        if (!/^\d+$/.test(movieId)) {
            return res.status(400).json({ error: "Invalid movie ID" });
        }

        const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
            params: {
                api_key: API_KEY,
                append_to_response: "credits"
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error("Movie details error:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch movie details" });
    }
});
app.get("/popular", async (req, res) => {
    try {
        const response = await axios.get(
            "https://api.themoviedb.org/3/movie/popular",
            {
                params: {
                    api_key: API_KEY
                }
            }
        );

        res.json(response.data);

    } catch (error) {
        console.error("Popular movies error:", error.response?.data || error.message);
        res.status(500).json({
            error: "Failed to fetch popular movies"
        });
    }
});
app.post("/register", (req, res) => {

    const { name, email, password } = req.body;

    db.run(
        "INSERT INTO users(name,email,password) VALUES(?,?,?)",
        [name, email, password],

        function(err){

            if(err){

                return res.status(400).json({
                    message:"Email already exists"
                });

            }

            res.json({
                message:"Registration Successful"
            });

        }

    );

});

app.post("/login", (req, res) => {

    const { email, password } = req.body;

    db.get(
        "SELECT * FROM users WHERE email=? AND password=?",
        [email, password],

        (err, user) => {

            if(err){
                return res.status(500).json({
                    message:"Server Error"
                });
            }

            if(!user){
                return res.status(401).json({
                    message:"Invalid Email or Password"
                });
            }

            res.json({
                message:"Login Successful"
            });

        }

    );

});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log("Open that link in your browser to use the website.");
});
