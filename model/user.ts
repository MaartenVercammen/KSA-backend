import { connectionPool } from "../database";
import { user } from "../types";

async function getUsers(onResult: (users: user[], err: Error) => void) {
  const query = "select u.id, u.name, email, r.name from ksa.user as u inner join ksa.roles as r on u.role = r.id";
  try {
    var { rows } = await connectionPool.query(query);
    onResult(<user[]>rows, null);
  } catch (error) {
    onResult(null, error);
  }
}

async function login(email: string, password: string, onResult: (user: Array<user>, err: Error) => void){
  const query = "select u.id, u.name, email, r.name as role from ksa.user as u inner join ksa.roles as r on u.role = r.id where u.email = $1 and u.password = $2"
  try{
    var {rows} = await connectionPool.query(query, [email, password])
    onResult(rows, null)
  }catch(error){
    onResult(null, error)
  }

}

export { getUsers, login };
