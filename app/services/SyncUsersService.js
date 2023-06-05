const axios = require('axios');
const config = require('./../config/settings');

const Locations = require("../models/Locations.js");
const GroupLocations = require("../models/GroupLocations.js");
const GroupStudents = require("../models/GroupStudents.js");
const StudentsV2 = require("../models/StudentsV2.js");


function getStudentsInformation(studentsId) {
    return new Promise((resolve, reject) => {
      StudentsV2.findByIds(studentsId, (err, data) => {
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
  }


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
                                
                                if (locationJson.requireRfid) {
                                    let studentsInformation = [];
                                
                                    getStudentsInformation(studentsId)
                                      .then((usersData) => {
                                        json = {
                                          location: locationJson,
                                          students: usersData,
                                        };
                                        postRequest(config.syncIPCardID.IP, config.syncIPCardID.port, "/data", json);

                                        response.send(json);
                                      })
                                      .catch((error) => {
                                        response.status(404).send({ message: error });
                                      });
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
    const requestOptions = {
        method: 'POST',
        url: `${url}:${port}${path}`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: json
    };
  
    axios(requestOptions)
        .then(response => {
            console.log(`statusCode: ${response.status}`);
            console.log(response.data);
        })
        .catch(error => {
            console.error(error);
        });
}