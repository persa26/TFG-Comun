// GroupLocations.js
const conn = require('./../db/dbConnection');

const GroupLocations = function (groupLocation) {
    this.id = groupLocation.id;
    this.groupId = groupLocation.groupId;
    this.locationId = groupLocation.locationId;
    this.entryTime = groupLocation.entryTime;
    this.exitTime = groupLocation.exitTime;
};

GroupLocations.getAll = (result) => {
    conn.query("SELECT * FROM GroupLocations", (err, res) => {
        if (err) {
            result(null, err);
            return
        }
        result(null, res);
    });
};

GroupLocations.findById = (groupLocationId, result) => {
    conn.query("SELECT * FROM GroupLocations WHERE id = ?", groupLocationId, (err, res) => {
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

GroupLocations.findByLocationId = (locationId, result) => {
    conn.query("SELECT * FROM GroupLocations WHERE locationId = ?", locationId, (err, res) => {
        if (err) {
            result(err, null);
            return
        }
        result(null, res);
    });
};

GroupLocations.create = (newGroupLocation, result) => {
    conn.query("INSERT INTO GroupLocations SET ?", newGroupLocation, (err, res) => {
        if (err) {
            result(err, null);
            return;
        } else {
            if (res.insertId != undefined && newGroupLocation) {
                let data = { id: res.insertId, ...newGroupLocation };
                //En la linea de encima no pilla el ID y no se porque, por eso lo asigno de nuevo aqui abajo. 
                data.id = res.insertId;
                result(null, data);
            }
        }
    });
};


GroupLocations.updateById = (id, groupLocation, result) => {
    conn.query(
        "UPDATE GroupLocations SET groupId = ?, locationId = ?, entryTime = ?, exitTime = ? WHERE id = ?",
        [groupLocation.groupId, groupLocation.locationId, groupLocation.entryTime, groupLocation.exitTime, id],
        (err, res) => {
            if (err) {
                result(null, err);
                return
            }
            if (res.affectedRows == 0) {
                result({ kind: "not_found" }, null);
                return
            }
            result(null, { id: id, ...groupLocation });
        }
    );
};

GroupLocations.remove = (id, result) => {
    conn.query("DELETE FROM GroupLocations WHERE id = ?", id, (err, res) => {
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
};


module.exports = GroupLocations
