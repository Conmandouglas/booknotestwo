// this file will (in the beginning):
// set up database
// fetch data from database
// send it to the front end of the website to render

// first:
// as a test to grab data, just send something simple to front end and get it to render
import express from "express";
import cors from "cors"; 
import backEnd from "./routes.js";

const PORT = 3000;
const app = express();

app.use(cors({origin: "*"}));
app.use("/", backEnd);

app.listen(PORT, () => {
  console.log(`API is running at http://localhost:${PORT}`);
});