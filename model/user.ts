import { connectionPool } from "../database";
import { user } from "../types";

async function getUsers(onResult: (users: user[], err: Error) => void) {
  const query = `select   birthdate
  city
  email
  firstname
  id
  lastname
  number
  password
  phone
  postalcode
  street
  typename  
  from ksa.user inner join ksa.usertype using(id)`;
  try {
    var { rows } = await connectionPool.query(query);
    onResult(<user[]>rows, null);
  } catch (error) {
    onResult(null, error);
  }
}

export { getUsers };
