import { Router } from "express";
import { fetchBooks } from "../frontend/dev-data/libs/bookRelat.js";
import pg from "pg";

const db = new pg.Client({
  user: 'postgres',
  host: 'localhost',
  database: 'booknotes', 
  password: 'the_password',
  port: 5432,
});

await db.connect().catch(err => console.log(err));

const backEnd = Router();

backEnd.get("/books", async (req, res) => {
  try {
    const books = await fetchBooks();
    console.log("Books fetched from database:", books);
    res.json(books); // Sends the JSON representation of 'books'
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

// Add a route to delete a review using POST
backEnd.post("/reviews/delete/:id", async (req, res) => {
  const reviewId = req.params.id;
  console.log(`Received request to delete review with ID: ${reviewId}`);
  try {
    // Get the book_id of the review to be deleted
    const reviewResult = await db.query('SELECT book_id FROM reviews WHERE id = $1', [reviewId]);
    const bookId = reviewResult.rows[0].book_id;

    // Delete the review
    await db.query('DELETE FROM reviews WHERE id = $1', [reviewId]);

    // Check if there are any remaining reviews for the book
    const remainingReviewsResult = await db.query('SELECT COUNT(*) FROM reviews WHERE book_id = $1', [bookId]);
    const remainingReviewsCount = parseInt(remainingReviewsResult.rows[0].count, 10);

    // If no remaining reviews, delete the book
    if (remainingReviewsCount === 0) {
      await db.query('DELETE FROM books WHERE id = $1', [bookId]);
    }

    console.log(`Review with ID: ${reviewId} deleted successfully`);
    res.status(200).json({ message: "Review (and book if no reviews left) deleted successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Failed to delete review" });
  }
});

// Add a route to delete a book using POST
backEnd.post("/books/delete/:id", async (req, res) => {
  const bookId = req.params.id;
  console.log(`Received request to delete book with ID: ${bookId}`);
  try {
    // Delete reviews associated with the book
    await db.query('DELETE FROM reviews WHERE book_id = $1', [bookId]);
    // Delete the book
    await db.query('DELETE FROM books WHERE id = $1', [bookId]);
    console.log(`Book with ID: ${bookId} deleted successfully`);
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Failed to delete book" });
  }
});

export default backEnd;