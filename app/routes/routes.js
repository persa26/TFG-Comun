const express = require('express'); //import express
const router = express.Router();
const usersController = require('./../controllers/UsersController');
const groupsController = require('./../controllers/GroupsController');
const authController = require('./../controllers/AuthController');
const studentsController = require('./../controllers/StudentsController');
const syncController = require('./../controllers/SyncController');
const locationsController = require('./../controllers/LocationsController');
const groupLocationsController = require('./../controllers/GroupLocationsController');
const identificationController = require('./../controllers/IdentificationController');
const groupStudentsController = require('./../controllers/GroupStudentsController');
const syncUsersService = require('./../services/SyncUsersService');
const userCanAccessService = require('./../services/UserCanAccessService');
const jwt = require('jsonwebtoken');

const path = require('path');
router.get('/students/imageurl/:imageName?', (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, '..', 'idImages', imageName);
    res.sendFile(imagePath);
});

router.post('/login', authController.login);
// router.use((request, response, next) => {
//     // if (!request.headers.authorization) return response.status(401).json({ success: false, message: 'No token provided' });
//     // jwt.verify(request.headers.authorization, 'secret', (err, decoded) => {
//     //     if (err) return response.status(401).json({ success: false, message: 'Failed to authenticate token.' });
//     //     next();
//     // });
// });


// Users routes
router.get('/users', usersController.getUsers);
router.get('/users/:id?', usersController.getUsers);
router.put('/users', usersController.putUser);
router.delete('/users', usersController.deleteUsers);
router.post('/profile-image', usersController.postProfileImage);

// Students routes
router.get('/students', studentsController.getStudents);
router.get('/students/:id?', studentsController.getStudents);
router.get('/students/:rfid?', studentsController.getStudents);
router.post('/students', studentsController.postStudent);
router.put('/students', studentsController.putStudent);
router.delete('/students/:id?', studentsController.deleteStudent);
router.post('/students/studentsphotos', studentsController.postStudentsPhotos);
router.get('/students/studentsphotos/:id?', studentsController.getStudentsPhotos);
router.delete('/students/studentsphotos/:id?', studentsController.deleteStudentsPhotos);

// Sync user data with face recognition system
router.get('/syncstudentsdatafacerecognition?', syncController.syncStudentsDataWithFaceRecognitionSystem);
router.get('/syncimagesdatafacerecognition?', syncController.syncImagesDataWithFaceRecognitionSystem);
router.get('/syncgroupsdatafacerecognition?', syncController.syncGroupsDataWithFaceRecognitionSystem);
// router.get('/studentsbyrfid/:id', studentsController.getStudentsByRFID);

// Identification routes
router.post('/facerecognition', identificationController.faceRecognition)

// Groups routes
router.get('/groups', groupsController.getGroups);
router.get('/groups/:id?', groupsController.getGroup);
router.post('/groups', groupsController.postGroup);
router.put('/groups/:id?', groupsController.putGroup);
router.delete('/groups/:id?', groupsController.deleteGroup);

// Locations routes
router.get('/locations', locationsController.getLocations);
router.get('/locations/:id?', locationsController.getLocation);
router.post('/locations', locationsController.postLocation);
router.put('/locations/:id?', locationsController.putLocation);
router.delete('/locations/:id?', locationsController.deleteLocation);

// Sync user data
router.get('/locations/:id/sync', syncUsersService.syncUsers);

// Sync user data
router.get('/students/:studentId/locations/:locationId/access/:accesMethod', userCanAccessService.userCanAccess);

// GroupLocations routes
router.get('/groupLocations', groupLocationsController.getGroupLocations);
router.get('/groupLocations/:id?', groupLocationsController.getGroupLocation);
router.post('/groupLocations', groupLocationsController.postGroupLocation);
router.put('/groupLocations/:id?', groupLocationsController.putGroupLocation);
router.delete('/groupLocations/:id?', groupLocationsController.deleteGroupLocation);

// test images

router.get('/groupStudents', groupStudentsController.getGroupStudents);
router.get('/groupStudents/:id?', groupStudentsController.getGroupStudent);
router.post('/groupStudents', groupStudentsController.create);
router.put('/groupStudents/:id?', groupStudentsController.putGroupStudent);
router.delete('/groupStudents/:id?', groupStudentsController.deleteGroupStudent);


module.exports = router;