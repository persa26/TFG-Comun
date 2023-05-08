const conn = require('../db/dbConnection');

function checkStudent(id) {

    let check;
    return new Promise((resolve, reject) => {

        conn.query(`SELECT * FROM Students WHERE id=${id}`, (err, result, rows) => {
            Object.keys(result).length === 0 ? check = false : check = true;
            if (check === true) {
                resolve(result[0]);
            } else {
                resolve(false);
            }
        });
    });
}

module.exports = { checkStudent }