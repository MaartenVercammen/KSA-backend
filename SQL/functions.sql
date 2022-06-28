create function addUser(ufirstname varchar, ulastname varchar, ubirthdate date, uemail varchar, uphone varchar, ustreet varchar, unumber integer, upostalcode integer, ucity varchar, upassword varchar, uusertype varchar)
returns boolean
as 
$$
DECLARE
id integer;
begin
select id into id from ksa.usertype where typename = uusertype;
if id is not null then
INSERT into ksa.user(firstname, lastname, birthdate, email, phone, street, number, postalcode, city, password, usertype)
    values(ufirstname, ulastname, ubirthdate, uemail, uphone, ustreet, unumber, upostalcode, ucity, upassword, id);
return true;
else
return false;
end if;
end;
$$
language 'plpgsql'