INSERT into ksa.roles("name")
    values('ADMIN');

INSERT into ksa.roles("name")
    values('GUEST');

INSERT into ksa.roles("name")
    values('MODERATOR');

INSERT into ksa.user("name", email, "password", 'role')
    values('Maarten', 'vercammen.maarten.2000@gmail.com','t', (select id from ksa.roles where name = 'ADMIN'))