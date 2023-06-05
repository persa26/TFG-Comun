const conn = require('./../db/dbConnection');

const AccessLogs = function (accessLogs) {
    this.id = accessLogs.id;
    this.studentId = accessLogs.studentId;
    this.locationId = accessLogs.locationId;
    this.accesMethod = accessLogs.accesMethod;
    this.accessTime = accessLogs.accessTime;
    this.canAccess = accessLogs.canAccess;
    this.accessDeniedReason = accessLogs.accessDeniedReason;
}

AccessLogs.getAll = (result) => {
    conn.query("SELECT * FROM AccessLogs", (err, res) => {
        if (err) {
            result(null, err);
            return
        }
        result(null, res);
    });
}

AccessLogs.create = (newAccessLogs, result) => {
    conn.query("INSERT INTO AccessLogs SET ?", newAccessLogs, (err, res) => {
        if (err) {
            result(err, null);
            return;
        } else {
            if (res.insertId != undefined && newAccessLogs) {
                let data = { id: res.insertId, ...newAccessLogs };
                //En la linea de encima no pilla el ID y no se porque, por eso lo asigno de nuevo aqui abajo. 
                data.id = res.insertId;
                result(null, data);
            }
        }
    });
}

module.exports = AccessLogs;