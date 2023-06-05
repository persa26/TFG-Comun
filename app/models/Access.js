const conn = require('./../db/dbConnection');

const Access = function (access) {
    this.id = access.id;
    this.studentId = access.studentId;
    this.groupId = access.groupId;
    this.locationId = access.locationId;
    this.facialRecognition = access.facialRecognition;
    this.rfid = access.rfid;
    this.accessTime = access.accessTime;
}

Access.getAll = (result) => {
    conn.query("SELECT * FROM Access", (err, res) => {
        if (err) {
            result(null, err);
            return
        }
        result(null, res);
    });
}

Access.getByStudentGroupLocation = (studentId, groupId, locationId, result) => {
    conn.query("SELECT * FROM Access WHERE studentId = ? AND groupId = ? AND locationId = ?", [studentId, groupId, locationId], (err, res) => {
        if (err) {
            result(null, err);
            return
        }
        result(null, res);
    });
}

Access.create = (newAccess, result) => {
    conn.query("INSERT INTO Access SET ?", newAccess, (err, res) => {
        if (err) {
            result(err, null);
            return;
        } else {
            if (res.insertId != undefined && newAccess) {
                let data = { id: res.insertId, ...newAccess };
                //En la linea de encima no pilla el ID y no se porque, por eso lo asigno de nuevo aqui abajo. 
                data.id = res.insertId;
                result(null, data);
            }
        }
    });
}

Access.updateFacialRecognition = (accessId, facialRecognition, result) => {
    conn.query("UPDATE Access SET facialRecognition = ? WHERE id = ?", [facialRecognition, accessId], (err, res) => {
        if (err) {
            result(err, null);
            return
        }
        result(null, res);
    });
}

Access.updateRfid = (accessId, rfid, result) => {
    conn.query("UPDATE Access SET rfid = ? WHERE id = ?", [rfid, accessId], (err, res) => {
        if (err) {
            result(err, null);
            return
        }
        result(null, res);
    });
}

Access.delete = (accessId, result) => {
    conn.query("DELETE FROM Access WHERE id = ?", accessId, (err, res) => {
        if (err) {
            result(err, null);
            return
        }
        result(null, res);
    });
}

module.exports = Access;