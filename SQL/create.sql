DROP SCHEMA IF EXISTS ksa CASCADE;

CREATE SCHEMA ksa;

SET search_path TO ksa;

DROP TABLE IF EXISTS usertype;

CREATE TABLE ksa."user" (
    id serial NOT NULL UNIQUE,
    "name" varchar(50) NOT NULL,
    email varchar(50) NOT NULL,
    password varchar(100) NOT NULL,
    CONSTRAINT PK_User PRIMARY KEY (ID, email)
);