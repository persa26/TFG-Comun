// LocationsController.js
delete require.cache[require.resolve('../models/Locations')];
const Locations = require('../models/Locations');

exports.getLocations = (request, response) => {
    Locations.getAll((err, data) => {
        if (err) {
            response.status(500).send({
                message: err.message || "Some error occurred while retrieving locations."
            });
        } else {
            response.send(data);
        }
    });
}

exports.getLocation = (request, response) => {
    Locations.findById(request.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                response.status(404).send({
                    message: `Not found location with id ${request.params.id}.`
                });
            } else {
                response.status(500).send({
                    message: "Error retrieving location with id " + request.params.id
                });
            }
        } else {
            response.send(data);
        }
    });
}

exports.postLocation = (request, response) => {
    if (!request.body) {
        response.status(400).send({
            message: "Content can not be empty!"
        });
    }
    const location = new Locations({
        locationName: request.body.locationName,
        facialRecognitionRequired: request.body.facialRecognitionRequired,
        rfidRequired: request.body.rfidRequired
    });

    Locations.create(location, (err, data) => {
        if (err) {
            response.status(500).send({
                message: err.message || "Some error occurred while creating the location."
            });
        } else {
            response.send(data);
        }
    });
}

exports.putLocation = (request, response) => {
    if (!request.body) {
        response.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Locations.updateById(
        request.params.id,
        new Locations(request.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    response.status(404).send({
                        message: `Not found location with id ${request.params.id}.`
                    });
                } else {
                    response.status(500).send({
                        message: "Error updating location with id " + request.params.id
                    });
                }
            } else {
                response.send(data);
            }
        }
    );
}

exports.deleteLocation = (request, response) => {
    Locations.remove(request.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                response.status(404).send({
                    message: `Not found location with id ${request.params.id}.`
                });
            } else {
                response.status(500).send({
                    message: "Could not delete location with id " + request.params.id
                });
            }
        } else {
            response.send({ message: `Location was deleted successfully!` });
        }
    });
}

