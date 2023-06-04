<template>
  <div id="app" class="studentsGroups">
    <h1 class="text-4xl font-bold text-gray-800">
      Lista de estudiantes por grupo
    </h1>
    <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
      @click="showAddStudentGroupForm = true">
      Añadir estudiante a grupo
    </button>
    <table class="w-full">
      <thead class="bg-gray-50 border-b-2 border-gray-200">
        <tr>
          <th class="p-4 text-sm font-semibold tracking-wide text-left">
            ID
          </th>
          <th class="p-4 text-sm font-semibold tracking-wide text-left">
            Nombre del estudiante
          </th>
          <th class="p-4 text-sm font-semibold tracking-wide text-left">
            Nombre del grupo
          </th>
          <th class="p-4 text-sm font-semibold tracking-wide text-left">Acción</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(studentGroup, index) in studentGroups" :key="studentGroup.id">
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
              <button class="bg-cyan-800 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-full mr-2"
                @click="editStudentGroup(studentGroup)">
                Editar
              </button>
              <button class="bg-red-800 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-full mr-2"
                @click="removeStudentGroup(index)">
                Eliminar
              </button>
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
        <tr v-if="showAddStudentGroupForm">
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
            <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
              @click="addStudentGroup">
              Crear
            </button>
            <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
              @click="cancelAddStudentGroup">
              Cancelar
            </button>
          </td>
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
