<template>
    <div id="app" class="users">
        <h1 class="text-4xl font-bold text-gray-800 mb-7">Identificación</h1>
        <table class="w-full mt-4" v-if="accessLogs.length > 0">
            <thead class="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                    <th class="p-4 text-sm font-semibold tracking-wide text-left">Nº</th>
                    <th class="p-4 text-sm font-semibold tracking-wide text-left">Estudiante</th>
                    <th class="p-4 text-sm font-semibold tracking-wide text-left">Grupo</th>
                    <th class="p-4 text-sm font-semibold tracking-wide text-left">Ubicación</th>
                    <th class="p-4 text-sm font-semibold tracking-wide text-left">Sistema</th>
                    <th class="p-4 text-sm font-semibold tracking-wide text-left">Hora</th>
                    <th class="p-4 text-sm font-semibold tracking-wide text-left">Acceso</th>
                    <th class="p-4 text-sm font-semibold tracking-wide text-left">Motivo</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in accessLogs" :key="item.id" :class="{ 'bg-gray-50': index % 2 === 0 }">
                    <td class="p-4 text-sm text-gray-700">{{ item.id }}</td>
                    <td class="p-4 text-sm text-gray-700">{{ getStudentName(item.studentId) }}</td>
                    <td class="p-4 text-sm text-gray-700">{{ getGroupName(item.groupId) }}</td>
                    <td class="p-4 text-sm text-gray-700">{{ getLocationName(item.locationId) }}</td>
                    <td class="p-4 text-sm text-gray-700">{{ item.accesMethod }}</td>
                    <td class="p-4 text-sm text-gray-700">{{ item.accessTime }}</td>
                    <td class="p-4">

                        <span v-if="item.canAccess"
                            class="bg-green-800 text-white font-bold py-2 px-4 rounded-full">Aceptado</span>
                        <span v-else class="bg-red-800 text-white font-bold py-2 px-6 rounded-full">Denegado</span>
                    </td>
                    <td class="p-4 text-sm text-gray-700">{{ item.accessDeniedReason }}</td>
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
            fields: ["id", "studentId", "groupId", "locationId", "accesMethod", "accessTime", "canAccess", "accessDeniedReason"],
            loading: false,
            accessLogs: [],
            locations: [],
            groups: [],
            mediaStream: null,
            mediaRecorder: null
        };
    },
    mounted() {
        this.fetchData();
        campusdb.getAccessLogs().then((res) => (this.accessLogs = res.data));
    },
    methods: {
        fetchData() {
            Promise.all([
                campusdb.getAccessLogs(),
                campusdb.getLocations(),
                campusdb.getGroups(),
                campusdb.getStudents(),
            ])
                .then(([accessLogsRes, locationsRes, groupsRes, studentsRes]) => {
                    this.accessLogs = accessLogsRes.data;
                    this.locations = locationsRes.data;
                    this.groups = groupsRes.data;
                    this.students = studentsRes.data;
                })
                .catch((error) => {
                    console.error(error);
                });

        },
        getGroupName(groupId) {
            const group = this.groups.find((group) => group.id === groupId);
            return group ? group.name : "";
        },
        getLocationName(locationId) {
            const location = this.locations.find((location) => location.id === locationId);
            return location ? location.locationName : "";
        },
        getStudentName(studentId) {
            const student = this.students.find((student) => student.id === studentId);
            return student ? student.name : "";
        },
    },
};
</script>
