import express from "express";
//import * as devData from "./dev-data/index.js";
import frontEnd from "./routes.js";

const PORT = 4000;

const app = express();
app.use(express.static("public"));
app.use("/", frontEnd);

app.listen(PORT, () => {
  /*console.log({
    users: devData.users,
    books: devData.books,
    reviews: devData.reviews
  });*/
  console.log(`WebServer running on port ${PORT}...`);
});