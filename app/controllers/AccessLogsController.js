delete require.cache[require.resolve('../models/AccessLogs')];
const AccessLogs = require('../models/AccessLogs');

exports.getAccessLogs = (request, response) => {
    AccessLogs.getAll((err, data) => {
        if (err) {
            response.status(500).send({
                message: err.message || "Some error occurred while retrieving access logs."
            });
        } else {
            response.send(data);
        }
    });
}
