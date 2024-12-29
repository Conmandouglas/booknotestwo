import { Router } from "express";
import axios from "axios";

const frontEnd = Router();

const API_URL = "http://localhost:3000";

frontEnd.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/books`);
    console.log("Books fetched from the backend:", response.data);
    res.render('index.ejs', { list: response.data, error: null });
  } catch (err) {
    console.log(err.message);
    res.render('index.ejs', { list: [], error: "Failed to fetch books" });
  }
});

frontEnd.get("/add", (req, res) => {
  res.render('edit.ejs');
});

export default frontEnd;