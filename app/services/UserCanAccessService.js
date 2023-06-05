// const StudentV2 = require('../models/StudentV2');
const GroupStudents = require('../models/GroupStudents');
const GroupLocations = require('../models/GroupLocations');
const Locations = require('../models/Locations');
const AccessLogs = require('../models/AccessLogs');
const { create } = require('../models/Groups');

// Creamos una función auxiliar que devuelve una promesa
const getLocation = (locationId) => {
    return new Promise((resolve, reject) => {
        Locations.findById(locationId, (err, data) => {
            if (err) {
                reject(`Not found location with id ${locationId}.`);
            } else {
                resolve(data);
            }
        });
    });
};

const getGroupIds = (locationId) => {
    return new Promise((resolve, reject) => {
        GroupLocations.findByLocationId(locationId, (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    reject(`Not found group location with id ${locationId}.`);
                } else {
                    reject("Error retrieving group location with id " + locationId);
                }
            } else {
                let groupIds = [];
                data.forEach(groupLocation => {
                    groupIds.push(groupLocation);
                });
                resolve(groupIds);
            }
        });
    });
};

const getStudentGroups = (studentId) => {
    return new Promise((resolve, reject) => {
        GroupStudents.findByStudentId(studentId, (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    reject(`Not found group with id ${studentId}.`);
                } else {
                    reject("Error retrieving group with id " + studentId);
                }
            } else {
                let groupIds = [];
                data.forEach(groupStudent => {
                    groupIds.push(groupStudent);
                });
                resolve(groupIds);
            }
        });
    });
};

const createAccessLog = (studentId, groupId, locationId, accesMethod, canAccess, accessDeniedReason) => {
    let accessLog = {
        studentId: studentId,
        groupId: groupId,
        locationId: locationId,
        accesMethod: accesMethod,
        accessTime: new Date(),
        canAccess: canAccess,
        accessDeniedReason: accessDeniedReason,
    };
    AccessLogs.create(accessLog, (err, data) => {
        if (err) {
            console.log(err);
        }
    });

};



exports.userCanAccess = (request, response) => {
    let studentId = request.params.studentId;
    let locationId = request.params.locationId;
    let accesMethod = request.params.accesMethod; // RFID OR FACIAL
    let canAccess = false;
    
    getLocation(locationId)
    .then((data) => {
        
        if ((accesMethod === "rfid" && data.rfidRequired === 0) || (accesMethod == "FACIAL" && data.facialRecognitionRequired === 0)) {
            createAccessLog(studentId, null, locationId, accesMethod, canAccess, "No se puede acceder por este metodo");
            return response.status(500).send(false);
        }
        
        getGroupIds(locationId)
        .then((data) => {

            let locationGroupsIds = [];
            data.forEach(groupLocation => {
                
                if(isInTimeRange(groupLocation.entryTime, groupLocation.exitTime)) {
                    locationGroupsIds.push(groupLocation.groupId);
                }
            });
            
            if (locationGroupsIds.length === 0) {
                createAccessLog(studentId, null, locationId, accesMethod, canAccess, "No hay ubicaciones a las que se pueda acceder con los grupos del usuario en esta hora");
                return response.status(500).send(false);
            }
            
            getStudentGroups(studentId)
            .then((data) => {

                data.forEach(groupStudent => {
                    if (locationGroupsIds.includes(groupStudent.groupId)) {
                        canAccess = true;
                        createAccessLog(studentId, groupStudent.groupId, locationId, accesMethod, canAccess, null);
                    }
                });
                
                if (canAccess == false) {
                    createAccessLog(studentId, null, locationId, accesMethod, canAccess, "El estudiante no pertenece a ningún grupo de esta ubicación");
                    return response.status(500).send(canAccess);
                } else {
                    return response.status(200).send(canAccess);
                }
            })
            .catch((error) => {
                return response.status(404).send({ message: error });
            });



        })
        .catch((error) => {
            return response.status(404).send({ message: error });
        });


    })
    .catch((error) => {
        return response.status(404).send({ message: error });
    });
}


function isInTimeRange(startTime, endTime) {
    const currentDate = new Date();
  
    // Parseamos las horas de inicio y fin
    const [startHour, startMinutes, startSeconds] = startTime.split(":");
    const [endHour, endMinutes, endSeconds] = endTime.split(":");
  
    // Creamos objetos Date para las horas de inicio y fin
    const startDate = new Date();
    startDate.setHours(startHour);
    startDate.setMinutes(startMinutes);
    startDate.setSeconds(startSeconds);
  
    const endDate = new Date();
    endDate.setHours(endHour);
    endDate.setMinutes(endMinutes);
    endDate.setSeconds(endSeconds);
  
    // Comprobamos si la hora actual está entre las horas de inicio y fin
    if (currentDate >= startDate && currentDate <= endDate) {
      return true;
    } else {
      return false;
    }
  }