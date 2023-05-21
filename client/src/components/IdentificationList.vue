<template>
    <div id="app" class="users">
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" @click="syncStudentsData">
            <span v-if="loading">Loading...</span>
            <span v-else>Sync Students Data</span>
        </button>
    </div>
</template>
  
<script>
import campusdb from "@/services/campusdb";
export default {
    data() {
        return {
            loading: false,
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
    },
};
</script>
  