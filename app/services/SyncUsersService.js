const axios = require('axios');
const config = require('./../config/settings');

const Locations = require("../models/Locations.js");
const GroupLocations = require("../models/GroupLocations.js");
const GroupStudents = require("../models/GroupStudents.js");
const StudentsV2 = require("../models/StudentsV2.js");
const { post } = require("../routes/routes.js");
const http = require('http');
const conn = require('../db/dbConnection');
const path = require('path');
const fs = require('fs');


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
                        GroupStudents.findByGroupIds(groupIds, async (err, data) => {
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
                                    json = JSON.stringify(json);
                                    try {
                                        const syncUsersPromise = syncUsersFaceRecognition(response, "/syncusersdata", json);
                                        const postData = await getStudentsImageData(response, json);
                                        await syncUsersPromise;
                                        await syncUsersFaceRecognition(response, "/syncimagesdata", postData);
                                        response.send(json);
                                    } catch (error) {
                                        response.status(500).json({ success: false, message: "Error syncing data with Face Recognition System" });
                                    }
                                }
                            }
                        });
                    }
                });

            }
        }
    });
};

function syncUsersFaceRecognition(response, endpoint, dataToSend) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: config.syncIPFaceRecognition.IP,
            port: config.syncIPFaceRecognition.port,
            path: endpoint,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': dataToSend.length,
            }
        };
        const postReq = http.request(options, (postRes) => {
            let data = '';
            postRes.on('data', (chunk) => {
                data += chunk;
            });
            postRes.on('end', () => {
                resolve();
            });
        });

        postReq.on('error', (error) => {
            reject(error);
            // response.status(500).json({ success: false, message: "Error syncing data with Face Recognition System" });
        });

        postReq.write(dataToSend);
        postReq.end();
    });

}

async function getStudentsImageData(response, data) {
    data = JSON.parse(data);
    studentsIds = data.students.join(',');

    return new Promise((resolve, reject) => {

        let query = `SELECT * FROM StudentsImage WHERE studentId IN (${studentsIds})`;
        conn.query(query, (err, rows) => {
            if (!rows) {
                return response.status(404).json({ success: false, message: 'No student images found' });
            }
            const mappedData = rows.map(row => {
                const { id, studentId, imageLocation } = row;
                const imagePath = path.join(__dirname, '..', '..', 'app', 'idImages', imageLocation);

                const imageBuffer = fs.readFileSync(imagePath);
                const imageBase64 = imageBuffer.toString('base64');
                return { id: id, studentId: studentId, image: imageBase64 };
            });
            resolve(JSON.stringify(mappedData));
        });
    });
}








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