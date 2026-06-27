const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_KEY;

const api = axios.create({
  baseURL: "https://v3.football.api-sports.io",
  headers: {
    "x-apisports-key": API_KEY
  }
});

// HOME
app.get("/", (req, res) => {
  res.send("API Football OK");
});

// TEAM SEARCH
app.get("/team/:name", async (req, res) => {
  try {
    const name = req.params.name;

    const response = await api.get(`/teams?search=${name}`);

    const teams = response.data?.response;

    if (!teams || teams.length === 0) {
      return res.json({ success: false });
    }

    res.json({
      success: true,
      team: teams[0].team
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// FIXTURES
app.get("/fixtures/:teamId", async (req, res) => {
  try {
    const teamId = req.params.teamId;

    const response = await api.get(`/fixtures?team=${teamId}&last=5`);

    res.json({
      success: true,
      matches: response.data.response
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
