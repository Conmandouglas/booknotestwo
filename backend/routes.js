import { Router } from "express";
import { books } from "../frontend/dev-data/libs/bookRelat.js"
import pg from "pg";

const db = new pg.Client({
  user: 'postgres',
  host: 'localhost',
  database: 'booknotes', 
  password: 'the_password',
  port: 5432,
});

const dbConnected = await db.connect().then(()=>true).catch(err => console.log(err));

const backEnd = Router();

backEnd.get("/books", async (req, res) => {
  console.log("Reviews route hit");
  console.log("Books fetches from database:", books.rows);
  res.json(books); // Sends the JSON representation of 'data'
});

/*backEnd.get("/edit", (req, res) => {
  res.render('edit.ejs');
});*/

export default backEnd;