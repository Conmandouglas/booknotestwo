import express from "express";
import axios from "axios";

const PORT = 4000;
const app = express();

const API_URL = "http://localhost:3000";

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/books`);
    console.log("Books fetched from the backend:", response.data);
    res.render('index.ejs', { list: response.data, error: null });
  } catch (err) {
    console.log(err.message);
    res.render('index.ejs', { list: [], error: "Failed to fetch books" });
  }
});

app.get("/add", (req, res) => {
  res.render('edit.ejs');
});

app.listen(PORT, () => {
  console.log(`WebServer running on port ${PORT}...`);
});

/*import express from "express";
import frontEnd from "./routes.js";
import addRoutes from "./addroutes.js";

const PORT = 4000;

const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", frontEnd);
app.use("/", addRoutes);

app.listen(PORT, () => {
  console.log(`WebServer running on port ${PORT}...`);
});*/