const conn = require('../db/dbConnection');
const config = require('./../config/settings');
const http = require('http');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function syncUsersDataWithFaceRecognitionSystem(request, response, next) {

    const postData = await getStudentsData(response);

    const options = {
        hostname: config.syncIPFaceRecognition.IP,
        port: config.syncIPFaceRecognition.port,
        path: '/syncdata',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': postData.length,
            // add any other headers you want to send here
        }
    };

    const postReq = http.request(options, (postRes) => {
        let data = '';
        postRes.on('data', (chunk) => {
            data += chunk;
        });
        postRes.on('end', () => {
            response.status(200).json({ success: true, message: "Syncing data with Face Recognition System" });
        });
    });

    postReq.on('error', (error) => {
        response.status(500).json({ success: false, message: "Error syncing data with Face Recognition System" });
    });

    postReq.write(postData);
    postReq.end();
}

async function migrateImages() {
    try {
        // Retrieve image routes from database
        const routes = await getRoutesFromDatabase();

        // Loop over routes and migrate each image
        for (let route of routes) {
            const image = await axios.get(route); // GET request to retrieve image
            const form = new FormData();
            form.append('image', fs.createReadStream(image.data), { knownLength: image.headers['content-length'] }); // attach image to POST request
            await axios.post('https://newapi.com/images', form, { headers: form.getHeaders() }); // POST request to new API to upload image
        }

        console.log('Image migration completed successfully.');
    } catch (error) {
        console.error('Error migrating images:', error);
    }
}

function getStudentsData(response) {
    return new Promise((resolve, reject) => {

        let query = "SELECT * FROM Students";
        conn.query(query, (err, rows) => {
            if (!rows) {
                return response.status(404).json({ success: false, message: 'No students found' });
            }
            mapStudents(rows);
            resolve(JSON.stringify(students))
            // return students;
        });
    });
}

function mapStudents(value) {
    students = value.map(student => {
        return {
            id: student.id,
            name: student.name,
            surname: student.surname,
            mail: student.mail,
            photo: student.photo,
            rfid: student.rfid,
        };
    });
}

// // // // // // // // // // // // // // // // // // // // 
const syncImagesDataWithFaceRecognitionSystem = async (request, response, next) => {
    const postData = await getStudentsImageData(response);

    const options = {
        hostname: config.syncIPFaceRecognition.IP,
        port: config.syncIPFaceRecognition.port,
        path: '/syncimagesdata',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': postData.length,
        }
    };

    const postReq = http.request(options, (postRes) => {
        let data = '';
        postRes.on('data', (chunk) => {
            data += chunk;
        });
        postRes.on('end', () => {
            response.status(200).json({ success: true, message: "Syncing data with Face Recognition System" });
        });
    });

    postReq.on('error', (error) => {
        response.status(500).json({ success: false, message: "Error syncing data with Face Recognition System" });
    });

    postReq.write(postData);
    postReq.end();
};

async function getStudentsImageData(response) {
    return new Promise((resolve, reject) => {

        let query = "SELECT * FROM StudentsImage";
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


module.exports = { syncUsersDataWithFaceRecognitionSystem, migrateImages, syncImagesDataWithFaceRecognitionSystem }