// GroupLocationsController.js
delete require.cache[require.resolve('../models/GroupLocations')];
const GroupLocations = require('../models/GroupLocations');

exports.getGroupLocations = (request, response) => {
    GroupLocations.getAll((err, data) => {
        if (err) {
            response.status(500).send({
                message: err.message || "Some error occurred while retrieving group locations."
            });
        } else {
            response.send(data);
        }
    });
}

exports.getGroupLocation = (request, response) => {
    GroupLocations.findById(request.params.id, (err, data) => {
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
            response.send(data);
        }
    });
}

exports.postGroupLocation = (request, response) => {// GroupLocationsController.js (continuación)
    if (!request.body) {
        response.status(400).send({
            message: "Content can not be empty!"
        });
    }
    const groupLocation = new GroupLocations({
        groupId: request.body.groupId,
        locationId: request.body.locationId,
        entryTime: request.body.entryTime,
        exitTime: request.body.exitTime
    });

    GroupLocations.create(groupLocation, (err, data) => {
        if (err) {
            response.status(500).send({
                message: err.message || "Some error occurred while creating the group location."
            });
        } else {
            response.send(data);
        }
    });
}

exports.putGroupLocation = (request, response) => {
    if (!request.body) {
        response.status(400).send({
            message: "Content can not be empty!"
        });
    }

    GroupLocations.updateById(
        request.params.id,
        new GroupLocations(request.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    response.status(404).send({
                        message: `Not found group location with id ${request.params.id}.`
                    });
                } else {
                    response.status(500).send({
                        message: "Error updating group location with id " + request.params.id
                    });
                }
            } else {
                response.send(data);
            }
        }
    );
}

exports.deleteGroupLocation = (request, response) => {
    GroupLocations.remove(request.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                response.status(404).send({
                    message: `Not found group location with id ${request.params.id}.`
                });
            } else {
                response.status(500).send({
                    message: "Could not delete group location with id " + request.params.id
                });
            }
        } else {
            response.send({ message: `Group location was deleted successfully!` });
        }
    });
}
