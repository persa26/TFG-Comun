const express = require('express'); //import express
const router = express.Router();
const usersController = require('./../controllers/UsersController');
const groupsController = require('./../controllers/GroupsController');
const authController = require('./../controllers/AuthController');
const studentsController = require('./../controllers/StudentsController');
const syncController = require('../controllers/syncController');
const jwt = require('jsonwebtoken');

router.post('/login', authController.login);
// router.post('/users', usersController.postUser);

router.use((request, response, next) => {
    if (!request.headers.authorization) return response.status(401).json({ success: false, message: 'No token provided' });
    jwt.verify(request.headers.authorization, 'secret', (err, decoded) => {
        if (err) return response.status(401).json({ success: false, message: 'Failed to authenticate token.' });
        next();
    });
});

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

// Sync user data with face recognition system
router.get('/syncusersdatafacerecognition?', syncController.syncUsersDataWithFaceRecognitionSystem);
router.get('/syncimagesdatafacerecognition?', syncController.syncImagesDataWithFaceRecognitionSystem);
// router.get('/studentsbyrfid/:id', studentsController.getStudentsByRFID);

// Groups routes
router.get('/groups', groupsController.getGroups);
router.get('/groups/:id?', groupsController.getGroup);
router.post('/groups', groupsController.postGroup);
router.put('/groups', groupsController.putGroup);
router.delete('/groups/:id?', groupsController.deleteGroup);


module.exports = router;