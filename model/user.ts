import { connectionPool } from "../database";
import { user } from "../types";
const { createHash } = require("crypto");

function hash(string) {
  return createHash("sha256").update(string).digest("hex");
}

async function getUsers(onResult: (users: user[], err: Error) => void) {
  const query =
    "select u.id as id, u.name as name, email as email, r.name as role from ksa.user as u inner join ksa.roles as r on u.role = r.id";
  try {
    var { rows } = await connectionPool.query(query);
    onResult(<user[]>rows, null);
  } catch (error) {
    onResult(null, error);
  }
}

async function login(
  email: string,
  password: string,
  onResult: (user: Array<user>, err: Error) => void
) {
  const query =
    "select u.id, u.name, email, r.name as role from ksa.user as u inner join ksa.roles as r on u.role = r.id where u.email = $1 and u.password = $2";
  try {
    const hashedpassword = hash(password);
    console.log(hashedpassword);
    var { rows } = await connectionPool.query(query, [email, hashedpassword]);
    onResult(rows, null);
  } catch (error) {
    onResult(null, error);
  }
}

export { getUsers, login };
