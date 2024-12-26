import pg from "pg";

const db = new pg.Client({
  user: 'postgres',
  host: 'localhost',
  database: 'booknotes', 
  password: 'the_password',
  port: 5432,
});

const dbConnected = await db.connect().then(()=>true).catch(err => console.log(err));

const checkUsersQuery = `
  SELECT *
  FROM users
  ORDER BY id DESC;
`;
const result = await db.query(checkUsersQuery);

const usersResult = result.rows;
console.log("array of users:" + usersResult);

export { users };