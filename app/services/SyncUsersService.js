const Locations = require("../models/Locations.js");
const GroupLocations = require("../models/GroupLocations.js");
const GroupStudents = require("../models/GroupStudents.js");
const StudentsV2 = require("../models/StudentsV2.js");

exports.syncUsers = (request, response) => {
    let locationId = request.params.id;

    Locations.findById(locationId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                response.status(404).send({
                    message: `Not found location with id ${locationId}.`
                });
            } else {
                response.status(500).send({
                    message: "Error retrieving location with id " + locationId
                });
            }
        } else {
            let locationJson = {
                locationId: locationId,
                name: data.locationName,
            };
            if (data.facialRecognitionRequired || data.rfidRequired) {
                GroupLocations.findByLocationId(locationId, (err, data) => {
                    if (err) {
                        if (err.kind === "not_found") {
                            response.status(404).send({
                                message: `Not found group location with id ${locationId}.`
                            });
                        } else {
                            response.status(500).send({
                                message: "Error retrieving group location with id " + locationId
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
                                
                                json = {
                                    location: locationJson,
                                    students: studentsId,
                                }

                                response.send(json);
                                
                                if (data.facialRecognitionRequired) {
                                    console.log("facialRecognitionRequired");
                                    // postRequest("localhost", 3000, JSON.stringify(json));
                                } 

                                if (data.rfidRequired) {
                                    console.log("rfidRequired");
                                    //postRequest("localhost", 3000, JSON.stringify(json));
                                }
                    
                                // retrieve post status
                                
                            }
                        });
                    }
                });
                
            }
        }
    });
};

// function to make a post request to the server with the json object as body
function postRequest(url, port, json) {
    const options = {
        hostname: url,
        port: port,
        path: '/api/v1/syncUsers',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': json.length
        }
    }

    const req = http.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`)

        res.on('data', d => {
            process.stdout.write(d)
        })
    })

    req.on('error', error => {
        console.error(error)
    })

    req.write(json)
    req.end()
}