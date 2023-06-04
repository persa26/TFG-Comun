delete require.cache[require.resolve('../models/StudentsV2')];
const StudentsV2 = require('../models/StudentsV2');

exports.findByIds = (request, response) => {
    StudentsV2.findByIds(request.params.ids, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                response.status(404).send({
                    message: `Not found students with ids ${request.params.ids}.`
                });
            } else {
                response.status(500).send({
                    message: "Error retrieving students with ids " + request.params.ids
                });
            }
        } else {
            response.send(data);
        }
    });
}
