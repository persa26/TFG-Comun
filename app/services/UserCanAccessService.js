// const StudentV2 = require('../models/StudentV2');
const GroupStudents = require('../models/GroupStudents');
const GroupLocations = require('../models/GroupLocations');
const Locations = require('../models/Locations');

// Creamos una función auxiliar que devuelve una promesa
const getLocation = (locationId) => {
    return new Promise((resolve, reject) => {
        Locations.findById(locationId, (err, data) => {
            if (err) {
            console.log("not existsLocation");
            reject(`Not found location with id ${locationId}.`);
            } else {
            console.log("existsLocation");
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



exports.userCanAccess = (request, response) => {
    let studentId = request.params.studentId;
    let locationId = request.params.locationId;
    let accesMethod = request.params.accesMethod; // RFID OR FACIAL
    let canAccess = false;
    console.log("///////////////////////////////////////////////////////////////////////////////////////////")
    console.log("Intenta acceder con el metodo " + accesMethod);

    // Llamamos a la función auxiliar y manejamos la promesa resultante
    getLocation(locationId)
    .then((data) => {
        // Existe la localización
        console.log(data);
        console.log(accesMethod);
        // Comprobamos que se pueda acceder por el método indicado
        if ((accesMethod === "rfid" && data.rfidRequired === 0) || (accesMethod == "FACIAL" && data.facialRecognitionRequired === 0)) {
            console.log("No se puede acceder por este metodo");
            return response.status(500).send(false);
        }

        // Buscamos los grupos asociados a la localización
        getGroupIds(locationId)
        .then((data) => {

            let locationGroupsIds = [];
            data.forEach(groupLocation => {
                // Comprueba que en la ubicación hay grupos a los que se pueda acceder a la hora actual
                if(isInTimeRange(groupLocation.entryTime, groupLocation.exitTime)) {
                    locationGroupsIds.push(groupLocation.groupId);
                }
            });

            // Si no hay id, no hay grupos a los que se pueda acceder por lo que no se puede acceder y devolvemos false
            if (locationGroupsIds.length === 0) {
                console.log("El usuario no tiene grupos con los que pueda acceder");
                return response.status(500).send(false);
            }
            
            // Buscamos los grupos asociados al estudiante y los compara con los grupos de la localización
            // Si el estudiante pertenece a alguno de los grupos de la localización, puede acceder
            // Si no, no puede acceder
            getStudentGroups(studentId)
            .then((data) => {

                data.forEach(groupStudent => {
                    if (locationGroupsIds.includes(groupStudent.groupId)) {
                        console.log("El estudiante puede acceder por pertenecer al grupo " + groupStudent.groupId);
                        canAccess = true;
                    }    
                });
                // Crear un json con canAccess y con algo indicando si falta el rfid o la cara. Hay que consultar en una nueva tabla...
                return response.status(200).send(canAccess);
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