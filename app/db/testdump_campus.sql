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

CREATE TABLE StudentsImage(
    id int NOT NULL AUTO_INCREMENT,
    imageLocation varchar(250) NOT NULL,
    studentId int NOT NULL,
    FOREIGN KEY (studentId) REFERENCES Students(id),
    PRIMARY KEY(id)
);

CREATE TABLE `Groups`(
    id int NOT NULL AUTO_INCREMENT,
    name varchar(50) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE GroupStudents(
    id int NOT NULL AUTO_INCREMENT,
    studentId int NOT NULL,
    groupId int NOT NULL,
    FOREIGN KEY (studentId) REFERENCES Students(id),
    FOREIGN KEY (groupId) REFERENCES `Groups`(id),
    PRIMARY KEY(id)
);

CREATE TABLE Locations(
    id int NOT NULL AUTO_INCREMENT,
    locationName varchar(50) NOT NULL,
    facialRecognitionRequired BOOL NOT NULL,
    rfidRequired BOOL NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE GroupLocations(
    id int NOT NULL AUTO_INCREMENT,
    groupId int NOT NULL,
    locationId int NOT NULL,
    entryTime time NOT NULL,
    exitTime time NOT NULL,
    FOREIGN KEY (groupId) REFERENCES `Groups`(id),
    FOREIGN KEY (locationId) REFERENCES Locations(id),
    PRIMARY KEY(id)
);

CREATE TABLE Access(
    id int NOT NULL AUTO_INCREMENT,
    studentId int NOT NULL,
    groupId int NOT NULL,
    locationId int NOT NULL,
    facialRecognition BOOL NOT NULL,
    rfid BOOL NOT NULL,
    accessTime time NOT NULL,
    FOREIGN KEY (studentId) REFERENCES Students(id),
    FOREIGN KEY (groupId) REFERENCES `Groups`(id),
    FOREIGN KEY (locationId) REFERENCES Locations(id),
    PRIMARY KEY(id)
);

CREATE TABLE AccessLogs(
    id int NOT NULL AUTO_INCREMENT,
    studentId int NOT NULL,
    groupId int,
    locationId int NOT NULL,
    accesMethod varchar(50) NOT NULL,
    accessTime time NOT NULL,
    canAccess BOOL NOT NULL,
    accessDeniedReason varchar(250),
    FOREIGN KEY (studentId) REFERENCES Students(id),
    FOREIGN KEY (groupId) REFERENCES `Groups`(id),
    FOREIGN KEY (locationId) REFERENCES Locations(id),
    PRIMARY KEY(id)
);


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
        'Pedro',
        'Jose',
        'pjose@mail.com',
        '',
        '987654321'
    );

INSERT INTO
    `Groups` (name)
VALUES
    ('1A');

INSERT INTO
    `Groups` (name)
VALUES
    ('2A');

INSERT INTO
    GroupStudents (studentId, groupId)
VALUES
    (1, 1);

INSERT INTO
    GroupStudents (studentId, groupId)
VALUES
    (2, 2);

-- Insert locations
INSERT INTO
    Locations (
        locationName,
        facialRecognitionRequired,
        rfidRequired
    )
VALUES
    ('Biblioteca', TRUE, FALSE),
    ('Laboratorio', FALSE, TRUE),
    ('Aula 101', TRUE, TRUE);

-- Insert group locations
INSERT INTO
    GroupLocations (groupId, locationId, entryTime, exitTime)
VALUES
    (1, 1, '08:00:00', '20:00:00'),
    (1, 2, '09:00:00', '18:00:00'),
    (2, 3, '08:30:00', '14:30:00');

ALTER USER 'admin' IDENTIFIED WITH mysql_native_password BY 'Welcome1';

flush privileges;

SET
    SESSION sql_mode = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';