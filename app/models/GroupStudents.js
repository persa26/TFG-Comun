const conn = require('./../db/dbConnection');

const GroupStudents = function (groupStudent) {
    this.id = groupStudent.id;
    this.studentId = groupStudent.studentId;
    this.groupId = groupStudent.groupId;
}

GroupStudents.getAll = (result) => {
    conn.query("SELECT * FROM GroupStudents", (err, res) => {
        if (err) {
            result(null, err);
            return
        }
        result(null, res);
    });
}

GroupStudents.findById = (groupStudentId, result) => {
    conn.query("SELECT * FROM GroupStudents WHERE id = ?", groupStudentId, (err, res) => {
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
}

GroupStudents.findByGroupId = (groupId, result) => {
    conn.query("SELECT * FROM GroupStudents WHERE groupId = ?", groupId, (err, res) => {
        if (err) {
            result(err, null);
            return
        }
        result(null, res);
    });
}

GroupStudents.findByGroupIds = (groupIds, result) => {
    conn.query("SELECT * FROM GroupStudents WHERE groupId IN (?)", [groupIds], (err, res) => {
        if (err) {
            result(err, null);
            return
        }
        result(null, res);
    });
}

module.exports = GroupStudents