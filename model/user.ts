import { connectionPool } from "../database";
import { user } from "../types";

async function getUsers(onResult: (users: user[], err: Error) => void) {
  const query = `select 
  birthdate,
  city,
  "email",
  firstname,
  u.id,
  lastname,
  number,
  password,
  phone,
  postalcode,
  street,
  typename 
  from ksa.user as u inner join ksa.usertype as ut on u.usertype = ut.id`;

  try {
    var { rows } = await connectionPool.query(query);
    onResult(<user[]>rows, null);
  } catch (error) {
    onResult(null, error);
  }
}

async function addUser(user: user, onResult: (err: Error) => void) {
  const query = `select ksa.addUser($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`
    try{
      const {rows} = await connectionPool.query(query, [user.firstname, user.lastname, user.birthdate, user.email, user.phone, user.street, user.number, user.postalcode, user.city, user.password, user.typename])
      console.log(rows[0].adduser)
      if(rows[0].adduser == true){
        onResult(null)
      }else{
        onResult(new Error('typename doesn\'t exist'))
      }
      
    }
    catch(err){
      onResult(err)
    }
}

async function deleteUser(id: number, onResult: (err: Error)=>void){
  const query = `delete from ksa.user where id = $1`;
  try{
    await connectionPool.query(query, [id])
    onResult(null)
  }
  catch(err){
    onResult(err)
  }
}

export { getUsers, addUser, deleteUser};
