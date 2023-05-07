--
-- Table
--

USE campusdb; 

CREATE TABLE SystemUsers(
    id int NOT NULL AUTO_INCREMENT,
    name varchar(50) NOT NULL,
    surname varchar(50) NOT NULL,
    password varchar(250) NOT NULL,
    mail varchar(250) NOT NULL,
    photo varchar(250),
    admin BOOL NOT NULL,
    creationDate int NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE Students(
    id int NOT NULL AUTO_INCREMENT,
    name varchar(50) NOT NULL,
    surname varchar(50) NOT NULL,
    mail varchar(250) NOT NULL,
    photo varchar(250),
    rfid varchar(250),
    PRIMARY KEY(id)
);

-- CREATE TABLE Rooms(
--     id int NOT NULL AUTO_INCREMENT,
--     name varchar(50) NOT NULL,
--     floor varchar(50) NOT NULL,
--     PRIMARY KEY(id)
-- );

-- CREATE TABLE IdentificationSystems (
--     id int NOT NULL AUTO_INCREMENT,
--     name varchar(50) NOT NULL,
--     type varchar(50) NOT NULL,
--     roomId varchar(250),
--     FOREIGN KEY (roomId) REFERENCES Rooms(id),
--     PRIMARY KEY(id)
-- );

-- CREATE TABLE Subjects(
--     id int NOT NULL AUTO_INCREMENT,
--     name varchar(50) NOT NULL,
--     credits integer(50) NOT NULL,
--     course varchar(250),
--     roomId int NOT,
--     FOREIGN KEY (roomId) REFERENCES Rooms(id),
--     PRIMARY KEY(id)
-- );

-- CREATE TABLE StudentSubject(
--     id int NOT NULL AUTO_INCREMENT,
--     studentId int NOT NULL,
--     subjectId int NOT NULL,
--     FOREIGN KEY (studentId) REFERENCES Students(id),
--     FOREIGN KEY (subjectId) REFERENCES Subjects(id),
--     PRIMARY KEY(id)
-- );


-- Create inserts for the tables
INSERT INTO
    SystemUsers (
        name,
        surname,
        password,
        mail,
        photo,
        admin,
        creationDate
    )
VALUES
    (
        'admin',
        'pear',
        "YWRtaW4=",
        'admin@mail.com',
        '/img/admin.png',
        1,
        1655074399
    );

INSERT INTO
    Students (
        name,
        surname,
        mail,
        photo,
        rfid
    )
VALUES
    (
        'Alberto',
        'Jimenez',
        'ajimenez@mail.com',
        '',
        '123456789'
    );


ALTER USER 'admin' IDENTIFIED WITH mysql_native_password BY 'Welcome1';

flush privileges;

SET SESSION sql_mode = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';