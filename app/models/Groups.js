const conn = require('./../db/dbConnection');

const Groups = function (group) {
    this.id = group.id;
    this.name = group.name;
};

Groups.getAll = (result) => {
    conn.query("SELECT * FROM `Groups`", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return
        }
        console.log("groups: ", res);
        result(null, res);
    });
};

Groups.findById = (groupId, result) => {
    conn.query("SELECT * FROM `Groups` WHERE id = ?", groupId, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return
        }
        if (res.length) {
            console.log("found group: ", res[0]);
            result(null, res[0]);
            return
        }
        result({ kind: "not_found" }, null);
    });
};

Groups.create = (newGroup, result) => {
    conn.query("INSERT INTO `Groups` SET ?", newGroup, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return
        }
    });
};

Groups.updateById = (id, group, result) => {
    conn.query(
        "UPDATE `Groups` SET name = ? WHERE id = ?",
        [group.name, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return
            }
            if (res.affectedRows == 0) {
                result({ kind: "not_found" }, null);
                return
            }
            console.log("updated group: ", { id: id, ...group });
            result(null, { id: id, ...group });
        }
    );
};

Groups.remove = (id, result) => {
    conn.query("DELETE FROM `Groups` WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return
        }
        if (res.affectedRows == 0) {
            result({ kind: "not_found" }, null);
            return
        }
        console.log("deleted group with id: ", id);
        result(null, res);
    });
};


module.exports = Groups
