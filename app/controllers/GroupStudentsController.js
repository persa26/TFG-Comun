delete require.cache[require.resolve('../models/GroupStudents')];
const GroupStudents = require('../models/GroupStudents');

exports.getGroupStudents = (request, response) => {
    GroupStudents.getAll((err, data) => {
        if (err) {
            response.status(500).send({
                message: err.message || "Some error occurred while retrieving group students."
            });
        } else {
            response.send(data);
        }
    });
}

exports.getGroupStudent = (request, response) => {
    GroupStudents.findById(request.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                response.status(404).send({
                    message: `Not found group student with id ${request.params.id}.`
                });
            } else {
                response.status(500).send({
                    message: "Error retrieving group student with id " + request.params.id
                });
            }
        } else {
            response.send(data);
        }
    });
}

exports.getGroupStudentsByGroupId = (request, response) => {
    GroupStudents.findByGroupId(request.params.groupId, (err, data) => {
        if (err) {
            response.status(500).send({
                message: "Error retrieving group students with groupId " + request.params.groupId
            });
        } else {
            response.send(data);
        }
    });
}

exports.postGroupStudent = (request, response) => {
    if (!request.body) {
        response.status(400).send({
            message: "Content can not be empty!"
        });
    }
    const groupStudent = new GroupStudents({
        studentId: request.body.studentId,
        groupId: request.body.groupId
    });

    GroupStudents.create(groupStudent, (err, data) => {
        if (err) {
            response.status(500).send({
                message: err.message || "Some error occurred while creating the group student."
            });
        } else {
            response.send(data);
        }
    });
}

exports.putGroupStudent = (request, response) => {
    if (!request.body) {
        response.status(400).send({
            message: "Content can not be empty!"
        });
    }
    GroupStudents.updateById(
        request.params.id,
        new GroupStudents(request.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    response.status(404).send({
                        message: `Not found group student with id ${request.params.id}.`
                    });
                } else {
                    response.status(500).send({
                        message: "Error updating group student with id " + request.params.id
                    });
                }
            } else {
                response.send(data);
            }
        }
    );
}

exports.deleteGroupStudent = (request, response) => {
    GroupStudents.remove(request.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                response.status(404).send({
                    message: `Not found group student with id ${request.params.id}.`
                });
            } else {
                response.status(500).send({
                    message: "Could not delete group student with id " + request.params.id
                });
            }
        } else response.send({ message: `Group student was deleted successfully!` });
    });
}
