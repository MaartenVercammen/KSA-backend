DROP SCHEMA IF EXISTS ksa CASCADE;

CREATE SCHEMA ksa;

SET search_path TO ksa;

CREATE TABLE ksa.roles (
    id serial not null UNIQUE,
    name varchar(20) not null UNIQUE,
    CONSTRAINT pk_roles PRIMARY kEY (id, name)
);

CREATE TABLE ksa."user" (
    id serial NOT NULL UNIQUE,
    "name" varchar(50) NOT NULL,
    email varchar(50) NOT NULL,
    password varchar(100) NOT NULL,
    role int not null,
    CONSTRAINT PK_User PRIMARY KEY (ID, email),
    CONSTRAINT FK_userroles FOREIGN KEY (role)
    REFERENCES ksa.roles(id) 
);