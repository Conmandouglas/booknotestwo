import { Router } from "express";
import axios from "axios";
import pg from "pg";

const db = new pg.Client({
  user: 'postgres',
  host: 'localhost',
  database: 'booknotes', 
  password: 'the_password',
  port: 5432,
});

await db.connect().catch(err => console.log(err));

const addRoutes = Router();

addRoutes.post("/add", async (req, res) => {
  const { title, author_name, text, grade } = req.body;

  // Check if the book already exists
  const checkBookExistQuery = `
    SELECT *
    FROM books
    WHERE title LIKE $1 || '%' AND author_name LIKE $2 || '%';
  `;
  const result = await db.query(checkBookExistQuery, [title, author_name]);
  
  let bookId;
  if (result.rows.length > 0) {
    bookId = result.rows[0].id;
    console.log("bookid:" + bookId);
  } else {
    // Generate img from OpenLibrary API
    const openLibraryUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author_name)}`;
    const openLibraryResponse = await axios.get(openLibraryUrl);
    const bookData = openLibraryResponse.data.docs[0];
    const imgLink = bookData ? `https://covers.openlibrary.org/b/id/${bookData.cover_i}-L.jpg` : "https://picsum.photos/200/300";

    const updateBooksQuery = `
      INSERT INTO books (title, author_name, img)
      VALUES ($1, $2, $3)
      RETURNING id
    `;
    try {
      const result = await db.query(updateBooksQuery, [title, author_name, imgLink]);
      bookId = result.rows[0].id;
      console.log("The new book id is " + bookId);
    } catch (err) {
      console.error("Error executing query", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
  }

  // Insert the review
  const updateReviewsQuery = `
    INSERT INTO reviews (user_id, book_id, text, grade)
    VALUES ($1, $2, $3, $4)
  `;
  try {
    await db.query(updateReviewsQuery, [1, bookId, text, grade]); // hardcoded user id of 1: connor
    res.redirect("/");
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default addRoutes;