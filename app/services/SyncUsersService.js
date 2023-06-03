const GroupLocations = require("../models/GroupLocations.js");
const GroupStudents = require("../models/GroupStudents.js");
const StudentsV2 = require("../models/StudentsV2.js");

exports.syncUsers = (request, response) => {
    GroupLocations.findByLocationId(request.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                response.status(404).send({
                    message: `Not found group location with id ${request.params.id}.`
                });
            } else {
                response.status(500).send({
                    message: "Error retrieving group location with id " + request.params.id
                });
            }
        } else {
            let groupIds = [];
            data.forEach(groupLocation => {
                groupIds.push(groupLocation.groupId);
            });
            GroupStudents.findByGroupIds(groupIds, (err, data) => {
                if (err) {
                    if (err.kind === "not_found") {
                        response.status(404).send({
                            message: `Not found group with id ${request.query.groupId}.`
                        });
                    } else {
                        response.status(500).send({
                            message: "Error retrieving group with id " + request.query.groupId
                        });
                    }
                } else {
                    let studentsId = [];
                    data.forEach(groupStudent => {
                        studentsId.push(groupStudent.studentId);
                    });

                    let json = {
                        location: request.params.id,
                        students: studentsId,
                    }
                    // TODO. Make a post request to the server with the json object as body
                    response.send(json);
                }
            });
        }
    });
};