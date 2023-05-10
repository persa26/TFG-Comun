const conn = require('./../db/dbConnection');
const config = require('./../config/settings');
const http = require('http');
const studentsController = require('./../controllers/StudentsController');
const { post } = require('../routes/routes');

async function syncDataWithFaceRecognitionSystem(request, response, next) {

    const postData = await getData(response);
    console.log(postData);



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
            console.log(data);
            response.status(200).json({ success: true, message: "Syncing data with Face Recognition System" });
        });
    });

    postReq.on('error', (error) => {
        console.error(error);
        response.status(500).json({ success: false, message: "Error syncing data with Face Recognition System" });
    });

    postReq.write(postData);
    postReq.end();
}




function getData(response) {
    return new Promise((resolve, reject) => {

        let query = "SELECT * FROM Students";
        conn.query(query, (err, rows) => {
            if (!rows) {
                return response.status(404).json({ success: false, message: 'No students found' });
            }
            mapStudents(rows);
            console.log("students mapped")
            resolve(JSON.stringify(students))
            // return students;
        });
    });
}

function mapStudents(value) {
    console.log("mapping students")
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

module.exports = { syncDataWithFaceRecognitionSystem }