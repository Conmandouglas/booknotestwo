import pg from "pg";

const db = new pg.Client({
  user: 'postgres',
  host: 'localhost',
  database: 'booknotes', 
  password: 'the_password',
  port: 5432,
});

await db.connect().catch(err => console.log(err));

const fetchReviews = async () => {
  const checkReviewsQuery = `
    SELECT *
    FROM reviews
    ORDER BY id DESC;
  `;
  const result = await db.query(checkReviewsQuery);
  const reviews = result.rows;
  console.log("this is reviews:", reviews);
  return reviews;
}

export { fetchReviews };