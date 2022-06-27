DROP SCHEMA IF EXISTS ksa CASCADE;

CREATE SCHEMA ksa;

SET search_path TO ksa;

DROP TABLE IF EXISTS usertype;

CREATE TABLE usertype (
    id serial NOT NULL UNIQUE,
    typename varchar(25) NOT NULL UNIQUE,
    description varchar(512),
    CONSTRAINT PK_Usertype PRIMARY KEY (id, typename)
);

CREATE TABLE "user" (
    id serial NOT NULL UNIQUE,
    firstname varchar(50) NOT NULL,
    lastname varchar(50) NOT NULL,
    birthdate date NOT NULL,
    email varchar(50) NOT NULL,
    phone varchar(20) NOT NULL,
    street varchar(30) NOT NULL,
    number integer NOT NULL,
    postalcode integer NOT NULL,
    city varchar(30) NOT NULL,
    password varchar(100) NOT NULL,
    usertype integer not null,
    CONSTRAINT PK_User PRIMARY KEY (ID, firstname, lastname),
    CONSTRAINT FK_user_usertype FOREIGN KEY (usertype) REFERENCES ksa.usertype (id)
);