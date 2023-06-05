const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const http = require('http');
const config = require('./../config/settings');

async function faceRecognition(request, response) {

    const options = {
        method: 'POST',
        hostname: config.syncIPFaceRecognition.IP,
        port: config.syncIPFaceRecognition.port,
        path: '/recognition/',
        headers: {},
        maxRedirects: 20
    };

    const videoBlob = request.files.file;
    if (!videoBlob) {
        console.error("No se encontró el video Blob adjunto en 'request.files.file'.");
        return;
    }

    const destinationPath = 'videos/' + videoBlob.name;

    videoBlob.mv(destinationPath, function (error) {
        if (error) {
            console.error("Error al mover el archivo:", error);
            return;
        }

        const videoBuffer = fs.readFileSync(destinationPath);
        fs.writeFileSync('video.mp4', videoBuffer, 'binary');

        const base64Video = videoBuffer.toString('base64');

        const postData = JSON.stringify({ video: base64Video });

        options.headers['Content-Type'] = 'application/json';
        options.headers['Content-Length'] = Buffer.byteLength(postData);

        const req = http.request(options, (res) => {
            let chunks = '';

            res.on('data', (chunk) => {
                chunks += chunk;
            });

            res.on('end', () => {
                const responseData = JSON.parse(chunks);
                response.json(responseData);
            });

            res.on('error', (error) => {
            });
        });

        req.write(postData);
        req.end();
    });
}


module.exports = { faceRecognition };
