const express = require('express'); //import express
const router = express.Router();
const usersController = require('./../controllers/UsersController');
const authController = require('./../controllers/AuthController');
const postsController = require('./../controllers/PostsController');
const studentsController = require('./../controllers/StudentsController');
const jwt = require('jsonwebtoken');

router.post('/login', authController.login);
// router.post('/users', usersController.postUser);
router.post('/students', studentsController.postStudent);

router.use((request, response, next) => {
    if (!request.headers.authorization) return response.status(401).json({ success: false, message: 'No token provided' });
    jwt.verify(request.headers.authorization, 'secret', (err, decoded) => {
        if (err) return response.status(401).json({ success: false, message: 'Failed to authenticate token.' });
        next();
    });
});

router.get('/users', usersController.getUsers);
router.get('/users/:id?', usersController.getUsers);
router.put('/users', usersController.putUser);
router.delete('/users', usersController.deleteUsers);
router.post('/profile-image', usersController.postProfileImage);
router.get('/posts', postsController.getPosts);
router.post('/posts', postsController.postPosts);
router.get('/students', studentsController.getStudents);
router.get('/students/:id?', studentsController.getStudents);
router.get('/students/:rfid?', studentsController.getStudents);
// router.get('/studentsbyrfid/:id', studentsController.getStudentsByRFID);


module.exports = router;