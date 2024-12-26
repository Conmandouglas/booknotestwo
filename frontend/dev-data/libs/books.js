import { reviews } from "./reviews.js";

const getReviews = (bookId) => {
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

const books = [
  {
    id: 1,
    title: "The Lord of the Rings",
    author_name: ["J.R.R. Tokien"],
    img: "https://covers.openlibrary.org/b/olid/OL51711454M-M.jpg",
    reviews: getReviews(1).bookReviews,
    average: getReviews(1).avrg,
  },

  // cover edition key

  // OL46773254M
  //img: "https://covers.openlibrary.org/b/olid/OL46773254M-M.jpg",

  {
  id: 2,
  title: "Charlotte's Web",
  author_name: ["E.B. White"],
  img: "https://covers.openlibrary.org/b/olid/OL9238180M-M.jpg",
  reviews: getReviews(2).bookReviews,
  average: getReviews(2).avrg,
  },
];

export { books };