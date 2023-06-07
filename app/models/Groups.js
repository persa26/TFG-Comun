const conn = require('./../db/dbConnection');

const Groups = function (group) {
    this.id = group.id;
    this.name = group.name;
};

Groups.getAll = (result) => {
    conn.query("SELECT * FROM `Groups`", (err, res) => {
        if (err) {
            result(null, err);
            return
        }
        result(null, res);
    });
};

Groups.findById = (groupId, result) => {
    conn.query("SELECT * FROM `Groups` WHERE id = ?", groupId, (err, res) => {
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

Groups.findByIds = (groupIds, result) => {
    conn.query("SELECT * FROM `Groups` WHERE id IN (?)", [groupIds], (err, res) => {
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
};

Groups.create = (newGroup, result) => {
    conn.query("INSERT INTO `Groups` SET ?", newGroup, (err, res) => {
        if (err) {
            result(err, null);
            return;
        } else {
            if (res.insertId != undefined && newGroup) {
                let data = { id: res.insertId, ...newGroup };
                //En la linea de encima no pilla el ID y no se porque, por eso lo asigno de nuevo aqui abajo. 
                data.id = res.insertId;
                result(null, data);
            }
        }
    });
};


Groups.updateById = (id, group, result) => {
    conn.query(
        "UPDATE `Groups` SET name = ? WHERE id = ?",
        [group.name, id],
        (err, res) => {
            if (err) {
                result(null, err);
                return
            }
            if (res.affectedRows == 0) {
                result({ kind: "not_found" }, null);
                return
            }
            result(null, { id: id, ...group });
        }
    );
};

Groups.remove = (id, result) => {
    conn.query("DELETE FROM GroupLocations WHERE groupId = ?", id, (err, res) => {
        if (err) {
            console.log("err1: ", err);
            result(null, err);
            return
        } else {
            conn.query("DELETE FROM GroupStudents WHERE groupId = ?", id, (err, res) => {
                if (err) {
                    console.log("err1: ", err);
                    result(null, err);
                    return
                } else {
                    conn.query("DELETE FROM `Groups` WHERE id = ?", id, (err, res) => {
                        if (err) {
                            console.log("err2: ", err);
                            result(null, err);
                            return
                        }
                    });
                }
            });
        }
    });
};



module.exports = Groups
