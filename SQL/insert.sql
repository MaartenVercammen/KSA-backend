INSERT INTO ksa.usertype (typeName, description)
    VALUES ('Leiding', 'Begeleider van de kinderen'), ('Lid', 'Is lid van de KSA'), ('Ouder', 'Is ouder van een lid');

INSERT into ksa.user(firstname, lastname, birthdate, email, phone, street, number, postalcode, city, password, usertype)
    values('Maarten', 'Vercammen', '2000-06-12', 'vercammen.maarten.2000@gmail.com', '0485681274', 'Hogeweg', 56, 3200, 'Aarschot', 't', (select id from ksa.usertype where typename = 'Leiding'))