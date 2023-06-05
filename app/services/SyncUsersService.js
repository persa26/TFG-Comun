const Locations = require("../models/Locations.js");
const GroupLocations = require("../models/GroupLocations.js");
const GroupStudents = require("../models/GroupStudents.js");
const StudentsV2 = require("../models/StudentsV2.js");


const getStudentInformation = (studentId) => {
    return new Promise((resolve, reject) => {
        StudentsV2.findById(studentId, (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    reject(`Not found student with id ${studentId}.`);
                } else {
                    reject("Error retrieving student with id " + studentId);
                }
            } else {
                resolve(data);
            }
        });
    });
};


exports.syncUsers = (request, response) => {
    console.log("//////////////////////////////////////////////////////////////////");
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
                requireFacialRecognition: data.facialRecognitionRequired,
                requireRfid: data.rfidRequired,
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
                                console.log(data);
                                console.log(locationJson);
                                
                                if (locationJson.requireRfid) {
                                    console.log("rfidRequired");
                                    let studentsInformation = [];

                                    studentsId.forEach(studentId => {
                                        console.log(studentId);
                                        // getStudentInformation(studentId)
                                        // .then((data) => {
                                        //     studentsInformation.push(data);
                                        // })
                                        // .catch((error) => {
                                        //     return response.status(404).send({ message: error });
                                        // });
                                    });
                        

                                    json = {
                                        location: locationJson,
                                        students: studentsInformation,
                                    }
                                    console.log(json);
                                    console.log("rfidRequired");
                                    postRequest("http://127.0.0.1", 5000, "/data", JSON.stringify(json));
                                    response.send(json);
                                    
                                }
                                
                                if (locationJson.requireFacialRecognition) {
                                    json = {
                                        location: locationJson,
                                        students: studentsId,
                                    }

                                    console.log("facialRecognitionRequired");
                                    // postRequest("localhost", 3000, JSON.stringify(json));
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
function postRequest(url, port, path, json) {
    fetch(url + ":" + port + path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(json)
    })
      .then(response => {
        console.log(`statusCode: ${response.status}`);
        return response.json();
      })
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error(error);
      });
}