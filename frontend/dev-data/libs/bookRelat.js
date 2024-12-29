import { fetchReviews } from "./reviewsRelat.js";
import pg from "pg";

const db = new pg.Client({
  user: 'postgres',
  host: 'localhost',
  database: 'booknotes', 
  password: 'the_password',
  port: 5432,
});

await db.connect().catch(err => console.log(err));

const getReviews = async (bookId) => {
  const reviews = await fetchReviews();
  let grades = [];
  const bookReviews = reviews.filter((review) => {
    if (review.book_id === bookId) {
      grades.push(review.grade);
      return review.book_id === bookId;
    }
  });
  const totalGrade = grades.reduce((acc, grade) => acc + grade, 0);
  const avrg = totalGrade / grades.length;
  return { bookReviews, avrg };
}

const fetchBooks = async () => {
  const checkBooksQuery = `
    SELECT *
    FROM books
    ORDER BY id DESC;
  `;
  const result = await db.query(checkBooksQuery);
  const booksResult = result.rows;
  console.log("array of books:", booksResult);

  let books = [];
  for (const book of booksResult) {
    const { bookReviews, avrg } = await getReviews(book.id);
    books.push({
      id: book.id,
      title: book.title,
      author_name: [book.author_name],
      img: "https://covers.openlibrary.org/b/olid/OL51711454M-M.jpg",
      reviews: bookReviews,
      average: avrg,
    });
    console.log("books updated! here's one:", books);
  }

  return books;
}

export { fetchBooks };