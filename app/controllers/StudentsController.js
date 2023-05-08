const conn = require('./../db/dbConnection');
let students = require('./../models/Students');
// const { Students } = require('../models/Students');

async function getStudents(request, response, next) {
    query = "SELECT * FROM Students";
    if (request.params.rfid) query = query + ` WHERE rfid=${request.params.rfid}`;

    conn.query(query, (err, rows) => {
        if (!rows) return response.status(404).json({ success: false, message: 'No users found' });
        mapStudents(rows);
        err ? response.status(500).json({ success: false, err, }) : response.json({ users }.users)
    });
};

function mapStudents(value) {
    users = value.map(user => {
        return {
            // id: user.id,
            name: user.name,
            surname: user.surname,
            mail: user.mail,
            photo: user.photo,
            rfid: user.rfid,
        };
    });
}

module.exports = { getStudents };
