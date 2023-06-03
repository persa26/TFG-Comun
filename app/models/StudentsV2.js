const conn = require('./../db/dbConnection');

const StudentsV2 = function (student) {
    this.id = student.id;
    this.name = student.name;
    this.surname = student.surname;
    this.mail = student.mail;
    this.photo = student.photo;
    this.rfid = student.rfid;
}

StudentsV2.findByIds = (studentIds, result) => {
    conn.query("SELECT * FROM `Students` WHERE id IN (?)", [studentIds], (err, res) => {
        if (err) {
            result(err, null);
            return
        }
        if (res.length) {
            result(null, res);
            return
        }
        result({ kind: "not_found" }, null);
    });
}

StudentsV2.getStudentName = (studentId, result) => {
    conn.query("SELECT name FROM `Students` WHERE id = ?", studentId, (err, res) => {
        if (err) {
            result(err, null);
            return
        }
        if (res.length) {
            result(null, res);
            return
        }
        result({ kind: "not_found" }, null);
    });
}

module.exports = StudentsV2