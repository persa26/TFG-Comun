<template>
    <div id="app" class="users">
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" @click="syncStudentsData">
            <span v-if="loading">Loading...</span>
            <span v-else>Sync Students Data</span>
        </button>
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            @click="recordAndSendVideo">
            <span v-if="loading">Loading...</span>
            <span v-else>Record and Send Video</span>
        </button>
        <table class="w-full mt-4" v-if="accessLogs.length > 0">
            <thead class="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                    <th class="p-4 text-sm font-semibold tracking-wide text-left">Nº</th>
                    <th class="p-4 text-sm font-semibold tracking-wide text-left">Nombre</th>
                    <th class="p-4 text-sm font-semibold tracking-wide text-left">Apellido</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in accessLogs" :key="item.id" :class="{ 'bg-gray-50': index % 2 === 0 }">
                    <td class="p-4 text-sm text-gray-700">{{ item.id }}</td>
                    <td class="p-4 text-sm text-gray-700">{{ item.name }}</td>
                    <td class="p-4 text-sm text-gray-700">{{ item.surname }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import campusdb from "@/services/campusdb";

export default {
    data() {
        return {
            loading: false,
            accessLogs: [],
            mediaStream: null,
            mediaRecorder: null
        };
    },
    methods: {
        async syncStudentsData() {
            this.loading = true;
            await campusdb.syncData("syncstudentsdatafacerecognition");
            await campusdb.syncData("syncimagesdatafacerecognition");
            await campusdb.syncData("syncgroupsdatafacerecognition");
            this.loading = false;
        },
        async recordAndSendVideo() {
            this.loading = true;
            this.mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            this.mediaRecorder = new MediaRecorder(this.mediaStream);
            let data = [];

            this.mediaRecorder.ondataavailable = event => data.push(event.data);
            this.mediaRecorder.start();

            let stopped = new Promise((resolve, reject) => {
                this.mediaRecorder.onstop = resolve;
                this.mediaRecorder.onerror = event => reject(event.name);
            });

            setTimeout(() => this.mediaRecorder.stop(), 500);

            await stopped;

            this.mediaStream.getTracks().forEach(track => track.stop());
            this.mediaStream = null;
            this.mediaRecorder = null;

            let blob = new Blob(data, { type: 'video/webm' });
            let file = new File([blob], 'video.webm', {
                type: 'video/webm'
            });

            let formData = new FormData();
            formData.append('file', file);

            campusdb.faceRecognition(file)
                .then(response => {
                    console.log(response);
                    let responseObject = JSON.parse(response);
                    this.accessLogs.push(...responseObject);
                    this.loading = false;
                })
                .catch(error => {
                    console.log(error);
                    this.loading = false;
                });

        },
    },
};
</script>
