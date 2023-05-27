// Locations.js
const conn = require('./../db/dbConnection');

const Locations = function (location) {
    this.id = location.id;
    this.locationName = location.locationName;
    this.facialRecognitionRequired = location.facialRecognitionRequired;
    this.rfidRequired = location.rfidRequired;
};

Locations.getAll = (result) => {
    conn.query("SELECT * FROM Locations", (err, res) => {
        if (err) {
            result(null, err);
            return
        }
        result(null, res);
    });
};

Locations.findById = (locationId, result) => {
    conn.query("SELECT * FROM Locations WHERE id = ?", locationId, (err, res) => {
        if (err) {
            result(err, null);
            return
        }
        if (res.length) {
            result(null, res[0]);
            return
        }
        result({ kind: "not_found" }, null);
    });
};

Locations.create = (newLocation, result) => {
    conn.query("INSERT INTO Locations SET ?", newLocation, (err, res) => {
        if (err) {
            result(err, null);
            return;
        } else {
            if (res.insertId != undefined && newLocation) {
                let data = { id: res.insertId, ...newLocation };
                //En la linea de encima no pilla el ID y no se porque, por eso lo asigno de nuevo aqui abajo. 
                data.id = res.insertId;
                result(null, data);
            }
        }
    });
};


Locations.updateById = (id, location, result) => {
    conn.query(
        "UPDATE Locations SET locationName = ?, facialRecognitionRequired = ?, rfidRequired = ? WHERE id = ?",
        [location.locationName, location.facialRecognitionRequired, location.rfidRequired, id],
        (err, res) => {
            if (err) {
                result(null, err);
                return
            }
            if (res.affectedRows == 0) {
                result({ kind: "not_found" }, null);
                return
            }
            result(null, { id: id, ...location });
        }
    );
};

Locations.remove = (id, result) => {
    conn.query("DELETE FROM GroupLocations WHERE locationId = ?", id, (err, res) => {
        if (err) {
            result(null, err);
            return
        }
        conn.query("DELETE FROM Locations WHERE id = ?", id, (err, res) => {
            if (err) {
                result(null, err);
                return
            }
            if (res.affectedRows == 0) {
                result({ kind: "not_found" }, null);
                return
            }
            result(null, res);
        });
    });
};




module.exports = Locations
