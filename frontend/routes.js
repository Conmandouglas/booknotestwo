import { Router } from "express";
import axios from "axios";

const frontEnd = Router();

const API_URL = "http://localhost:3000";

frontEnd.get("/", async (req, res) => {
  const response = await axios.get(`${API_URL}/books`)
  .catch((err) => {
    console.log(err.message);
    return { data: [] };
  });
  console.log("books fetched from the backend:", response.data);
  res.render('index.ejs', { list: response.data });
});

frontEnd.get("/edit", (req, res) => {
  res.render('edit.ejs');
});

export default frontEnd;