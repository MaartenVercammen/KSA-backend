import { connectionPool } from "../database";
import { user } from "../types";

async function getUsers(onResult: (users: user[], err: Error) => void) {
  const query = "select * from ksa.user";
  try {
    var { rows } = await connectionPool.query(query);
    onResult(<user[]>rows, null);
  } catch (error) {
    onResult(null, error);
  }
}

export { getUsers };
