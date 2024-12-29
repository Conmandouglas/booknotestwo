import express from "express";
import cors from "cors";
import pg from "pg";

const PORT = 3000;
const app = express();
app.use(express.static("public"));

const db = new pg.Client({
  user: 'postgres',
  host: 'localhost',
  database: 'booknotes',
  password: 'the_password',
  port: 5432,
});

await db.connect().catch(err => console.log(err));

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Fetch books
app.get("/books", async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM books ORDER BY id DESC');
    const books = result.rows;

    // Fetch reviews for each book
    for (let book of books) {
      const reviewsResult = await db.query('SELECT * FROM reviews WHERE book_id = $1', [book.id]);
      book.reviews = reviewsResult.rows;
    }

    console.log("Books fetched from database:", books);
    res.json(books); // Sends the JSON representation of 'books'
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

// Delete a review
app.post("/reviews/delete/:id", async (req, res) => {
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
    res.redirect("/"); // Redirect to the homepage after deletion
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Failed to delete review" });
  }
});

// Delete a book
app.post("/books/delete/:id", async (req, res) => {
  const bookId = req.params.id;
  console.log(`Received request to delete book with ID: ${bookId}`);
  try {
    // Delete reviews associated with the book
    await db.query('DELETE FROM reviews WHERE book_id = $1', [bookId]);
    // Delete the book
    await db.query('DELETE FROM books WHERE id = $1', [bookId]);
    console.log(`Book with ID: ${bookId} deleted successfully`);
    res.redirect("/"); // Redirect to the homepage after deletion
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Failed to delete book" });
  }
});

app.listen(PORT, () => {
  console.log(`API is running at http://localhost:${PORT}`);
});

/*import express from "express";
import cors from "cors"; 
import backEnd from "./routes.js";

const PORT = 3000;
const app = express();

app.use(cors({origin: "*"}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", backEnd);

app.listen(PORT, () => {
  console.log(`API is running at http://localhost:${PORT}`);
});*/