import { connectionPool } from "../database";
import { user } from "../types";

async function getUsers(onResult: (users: user[], err: Error) => void) {
  const query = `select 
  birthdate,
  city,
  "email",
  firstname,
  id,
  lastname,
  number,
  password,
  phone,
  postalcode,
  street,
  typename  
  from ksa.user inner join ksa.usertype using(id)`;
  try {
    var { rows } = await connectionPool.query(query);
    onResult(<user[]>rows, null);
  } catch (error) {
    onResult(null, error);
  }
}

async function addUser(user: user, onResult: (err: Error) => void) {
  const query = `INSERT into ksa.user(firstname, lastname, birthdate, email, phone, street, number, postalcode, city, password, usertype)
  values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, (select id from ksa.usertype where typename = $11))`
    try{
      var {rows} = await connectionPool.query(query, [user.firstname, user.lastname, user.birthdate, user.email, user.phone, user.street, user.number, user.postalcode, user.city, user.password, user.typename])
      onResult(null)
    }
    catch(err){
      onResult(err)
    }
}

export { getUsers, addUser};
