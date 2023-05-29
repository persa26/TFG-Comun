const FormData = require('form-data');
const axios = require('axios');
const axiosConfig = axios.create({
    maxBodyLength: 50 * 1024 * 1024 // 50 MB
});
const config = require('./../config/settings');

async function faceRecognition(request, response) {
    const formData = new FormData();
    const videoFile = request.files && request.files.file;
    formData.append('file', videoFile.data, {
        filename: videoFile.name,
    });

    const url = `http://${config.syncIPFaceRecognition.IP}:${config.syncIPFaceRecognition.port}/recognition/`;

    try {
        const axiosResponse = await axios.post(url, formData, axiosConfig);
        return response.json(axiosResponse.data)
    } catch (error) {
        return error;
    }
}

module.exports = { faceRecognition };
