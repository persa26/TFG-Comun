delete require.cache[require.resolve('../models/Groups')];
const Groups = require('../models/Groups');

exports.getGroups = (request, response) => {
    Groups.getAll((err, data) => {
        if (err) {
            response.status(500).send({
                message: err.message || "Some error occurred while retrieving groups."
            });
        } else {
            response.send(data);
        }
    });
}

exports.getGroup = (request, response) => {
    Groups.findById(request.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                response.status(404).send({
                    message: `Not found group with id ${request.params.id}.`
                });
            } else {
                response.status(500).send({
                    message: "Error retrieving group with id " + request.params.id
                });
            }
        } else {
            response.send(data);
        }
    });
}

exports.postGroup = (request, response) => {
    if (!request.body) {
        response.status(400).send({
            message: "Content can not be empty!"
        });
    }
    const group = new Groups({
        name: request.body.name
    });

    Groups.create(group, (err, data) => {
        if (err) {
            response.status(500).send({
                message: err.message || "Some error occurred while creating the group."
            });
        } else {
            response.send(data);
        }
    });
}

exports.putGroup = (request, response) => {
    if (!request.body) {
        response.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Groups.updateById(
        request.params.id,
        new Groups(request.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    response.status(404).send({
                        message: `Not found group with id ${request.params.id}.`
                    });
                } else {
                    response.status(500).send({
                        message: "Error updating group with id " + request.params.id
                    });
                }
            } else {
                response.send(data);
            }
        }
    );
}

exports.deleteGroup = (request, response) => {
    Groups.remove(request.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                response.status(404).send({
                    message: `Not found group with id ${request.params.id}.`
                });
            } else {
                response.status(500).send({
                    message: "Could not delete group with id " + request.params.id
                });
            }
        } else {
            response.send({ message: `Group was deleted successfully!` });
        }
    });
}
