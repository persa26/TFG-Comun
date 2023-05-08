const e = require('express');
const conn = require('./../db/dbConnection');
let helper = require('../helpers/checkIfStudentExists');
let students = require('./../models/Students');
// const { Students } = require('../models/Students');

async function getStudents(request, response, next) {
    query = "SELECT * FROM Students";
    if (request.params.id) query = query + ` WHERE id=${request.params.id}`;
    if (request.query.rfid) query = query + ` WHERE rfid=${request.query.rfid}`;

    conn.query(query, (err, rows) => {
        if (!rows) return response.status(404).json({ success: false, message: 'No students found' });
        mapStudents(rows);
        err ? response.status(500).json({ success: false, err, }) : response.json({ students }.students)
    });
};

const postStudent = async (request, response, next) => {
    const { name, surname, mail, rfid = "", photo = "" } = request.body;

    if (!name) return response.status(400).json({ success: false, message: "No name" });
    if (!surname) return response.status(400).json({ success: false, message: "No surname" });
    if (!mail) return response.status(400).json({ success: false, message: "No mail" });

    try {
        if ((await checkDuplicatedMail(mail)).length > 0) return response.status(400).json({ success: false, message: "Mail already exists" });
        if (rfid !== "" && (await checkDuplicatedRFID(rfid)).length > 0) return response.status(400).json({ success: false, message: "RFID already exists" });
        await insertNewStudent(name, surname, mail, photo, rfid);
        return response.json({ success: true });
    } catch (err) {
        return response.status(500).json({ success: false, err });
    }
};

const putStudent = async (request, response, next) => {
    const { id, name, surname, mail, rfid = "", photo = "" } = request.body;

    if (!id) return response.status(400).json({ success: false, message: "No id" });
    if (!name) return response.status(400).json({ success: false, message: "No name" });
    if (!surname) return response.status(400).json({ success: false, message: "No surname" });
    if (!mail) return response.status(400).json({ success: false, message: "No mail" });


    try {
        const studentExists = await helper.checkStudent(id);
        if (!studentExists) return response.status(404).json({ success: false, message: "Student not found" });

        if (rfid !== "") {
            const duplicatedRFIDs = await checkDuplicatedRFID(rfid);
            if (duplicatedRFIDs.length > 0 && duplicatedRFIDs[0].id != id) {
                return response.status(400).json({ success: false, message: "RFID already exists" });
            }
        }

        await updateStudent(parseInt(id), name, surname, mail, photo, rfid);
        return response.json({ success: true });

    } catch (err) {
        return response.status(500).json({ success: false, err });
    }
};


async function updateStudent(id, name, surname, mail, photo, rfid) {
    return new Promise((resolve, reject) => {
        conn.query(
            `UPDATE Students SET name='${name}', surname='${surname}', mail='${mail}', photo='${photo}', rfid='${rfid}' WHERE id=${id}`,
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            }
        );
    });
}

async function insertNewStudent(name, surname, mail, photo, rfid) {
    await new Promise((resolve, reject) => {
        conn.query(
            `INSERT INTO Students (name, surname, mail, photo, rfid) VALUES ('${name}', '${surname}', '${mail}', '${photo}', '${rfid}')`,
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            }
        );
    });
}

async function checkDuplicatedRFID(rfid) {
    return await new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM Students WHERE rfid='${rfid}'`, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

async function checkDuplicatedMail(mail) {
    return await new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM Students WHERE mail='${mail}'`, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

function mapStudents(value) {
    students = value.map(student => {
        return {
            id: student.id,
            name: student.name,
            surname: student.surname,
            mail: student.mail,
            photo: student.photo,
            rfid: student.rfid,
        };
    });
}

module.exports = { getStudents, postStudent, putStudent };
