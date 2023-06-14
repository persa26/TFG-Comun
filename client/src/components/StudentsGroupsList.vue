<template>
  <div id="app">
    <div class="studentsGroups">
      <div class="flex items-center mb-7 ">
        <h1 class="text-4xl font-bold text-gray-800 mt-4">
          Lista de estudiantes por grupo
        </h1>
        <button
          class="bg-transparent hover:bg-green-100 text-green-500 font-bold py-2 px-4 rounded-full mr-4 outline-none border-2 border-green-500 transition-colors duration-300 ring-green-500 ring-offset-2"
          style="margin-left: 1%;" @click="showAddStudentGroupForm = true">
          + Añadir estudiante a grupo
        </button>
      </div>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full border border-gray-200 divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="p-4 text-sm font-semibold tracking-wide text-left w-1/12">ID</th>
            <th class="p-4 text-sm font-semibold tracking-wide text-left w-4/12">Nombre del estudiante</th>
            <th class="p-4 text-sm font-semibold tracking-wide text-left w-4/12">Nombre del grupo</th>
            <th class="p-4 text-sm font-semibold tracking-wide text-left w-3/12">Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(studentGroup, index) in studentGroups" :key="studentGroup.id"
            class="bg-white divide-x divide-gray-200">
            <td class="p-4 text-sm text-gray-700">
              {{ studentGroup.id }}
            </td>
            <td class="p-4 text-sm text-gray-700">
              <template v-if="!studentGroup.editable">
                {{ getStudentName(studentGroup.studentId) }}
              </template>
              <template v-else>
                <select v-model="studentGroup.studentId" class="border-2 border-gray-300 p-2 w-full">
                  <option v-for="student in students" :key="student.id" :value="student.id">
                    {{ student.name }}
                  </option>
                </select>
              </template>
            </td>
            <td class="p-4 text-sm text-gray-700">
              <template v-if="!studentGroup.editable">
                {{ getGroupName(studentGroup.groupId) }}
              </template>
              <template v-else>
                <select v-model="studentGroup.groupId" class="border-2 border-gray-300 p-2 w-full">
                  <option v-for="group in groups" :key="group.id" :value="group.id">
                    {{ group.name }}
                  </option>
                </select>
              </template>
            </td>
            <td class="p-4 text-sm text-gray-700">
              <template v-if="!studentGroup.editable">
                <div class="flex space-x-2">

                  <button
                    class="bg-cyan-800 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-1"
                    @click="editStudentGroup(studentGroup)">
                    <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="h-4 w-4">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125">
                      </path>
                    </svg>
                    <span class="ml-1">Editar</span>
                  </button>
                  <button
                    class="bg-red-800 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-1 mr-2"
                    @click="removeStudentGroup(index)">
                    <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="h-4 w-4">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0">
                      </path>
                    </svg>
                    <span>Eliminar</span>
                  </button>
                </div>
              </template>
              <template v-else>
                <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full mr-2"
                  @click="saveStudentGroup(studentGroup)">
                  Guardar
                </button>
                <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
                  @click="cancelEditStudentGroup(studentGroup)">
                  Cancelar
                </button>
              </template>
            </td>
          </tr>
          <tr v-if="showAddStudentGroupForm" class="bg-white divide-x divide-gray-200">
            <td class="p-4 text-sm text-gray-700">
              #
            </td>
            <td class="p-4 text-sm text-gray-700">
              <select v-model="newStudentGroups.studentId" class="border-2 border-gray-300 p-2 w-full">
                <option v-for="student in students" :key="student.id" :value="student.id">
                  {{ student.name }}
                </option>
              </select>
            </td>
            <td class="p-4 text-sm text-gray-700">
              <select v-model="newStudentGroups.groupId" class="border-2 border-gray-300 p-2 w-full">
                <option v-for="group in groups" :key="group.id" :value="group.id">
                  {{ group.name }}
                </option>
              </select>
            </td>
            <td class="p-4 text-sm text-gray-700">
              <div class="flex space-x-2">
                <button
                  class="bg-green-800 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-1"
                  @click="addStudentGroup">
                  + Añadir
                </button>
                <button
                  class="bg-red-800 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-1"
                  @click="cancelAddStudentGroup">
                  Cancelar
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import campusdb from "@/services/campusdb";
export default {
  data() {
    return {
      fields: ["id", "studentId", "groupId", "action"],
      id: "",
      groupId: "",
      locationId: "",
      studentGroups: [],
      students: [],
      groups: [],
      originalStudentGroups: null,
      showAddStudentGroupForm: false,
      newStudentGroups: {
        studentId: "",
        groupId: "",
      }
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      Promise.all([
        campusdb.getStudentGroups(),
        campusdb.getGroups(),
        campusdb.getStudents(),
      ])
        .then(([studentGroupsRes, groupsRes, studentsRes]) => {
          this.studentGroups = studentGroupsRes.data;
          this.groups = groupsRes.data;
          this.students = studentsRes.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getStudentName(studentId) {
      const student = this.students.find((student) => student.id === studentId);
      return student ? student.name : "";
    },
    getGroupName(groupId) {
      const group = this.groups.find((group) => group.id === groupId);
      return group ? group.name : "";
    },
    editStudentGroup(studentGroup) {
      studentGroup.editable = true;
    },
    cancelEditStudentGroup(studentGroup) {
      studentGroup.editable = false;
    },
    saveStudentGroup(studentGroup) {
      console.log(studentGroup);
      campusdb
        .updateStudentGroup(studentGroup.id, {
          studentId: studentGroup.studentId,
          groupId: studentGroup.groupId,
        })
        .then(() => {
          studentGroup.editable = false;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    removeStudentGroup(index) {
      if (!confirm("CONFIRMAR: Eliminar registro")) return;
      const studentGroup = this.studentGroups[index];
      campusdb
        .deleteStudentGroup(studentGroup.id)
        .then(() => {
          this.studentGroups.splice(index, 1);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    addStudentGroup() {
      console.log(this.newStudentGroups);
      campusdb
        .addStudentGroup({
          studentId: this.newStudentGroups.studentId,
          groupId: this.newStudentGroups.groupId,
        })
        .then((res) => {
          this.studentGroups.push(res.data);
          window.location.reload()
          this.cancelAddStudentGroup();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    cancelAddStudentGroup() {
      this.showAddStudentGroupForm = false;
      this.newStudentGroups.studentId = "";
      this.newStudentGroups.groupId = "";
    },
  },

};
</script>
