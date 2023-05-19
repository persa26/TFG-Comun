<template>
  <div id="app" class="users">
    <h1 class="text-4xl font-bold text-gray-800">Lista de estudiantes</h1>
    <button
        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
        @click="addStudent"
      >
        Añadir estudiante
      </button>
    <table class="w-full">
      <thead class="bg-gray-50 border-b-2 border-gray-200">
        <tr>
          <th class="p-4 text-sm font-semibold tracking-wide text-left">Nº</th>
          <th class="p-4 text-sm font-semibold tracking-wide text-left">Imagen</th>
          <th class="p-4 text-sm font-semibold tracking-wide text-left">Name</th>
          <th class="p-4 text-sm font-semibold tracking-wide text-left">Surname</th>
          <th class="p-4 text-sm font-semibold tracking-wide text-left">Mail</th>
          <th class="p-4 text-sm font-semibold tracking-wide text-left">RFID</th>
          <th class="p-4 text-sm font-semibold tracking-wide text-left">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="bg-gray-50"
          v-for="(student, index) in students"
          v-bind:key="student"
        >
          <td class="p-4 text-sm text-gray-700">{{ student.id }}</td>
          <td v-if="student.photo" class="p-4 text-sm text-gray-700 rounded-full h-12 w-12 mr-2"><img :src="student.photo" alt="User image"></td>
          <td v-else class="p-2 h-12 w-12 mr-2"><img src="https://i.pravatar.cc/100" alt="User image"></td>
          <td class="p-4 text-sm text-gray-700">{{ student.name }}</td>
          <td class="p-4 text-sm text-gray-700">{{ student.surname }}</td>
          <td class="p-4 text-sm text-gray-700">{{ student.mail }}</td>
          <td class="p-4 text-sm text-gray-700">{{ student.rfid }}</td>
          <td class="p-4 text-sm text-gray-700">
            <button
              class="bg-cyan-800 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full mr-2"
              @click="editStudent(index)"
            >
              Edit
            </button>
            <button
              class="bg-red-800 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full"
              @click="removeStudent(index)"
            >
              Delete
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
      fields: ["id", "name", "surname", "mail", "rfid", "action"],
      id: "",
      name: "",
      surname: "",
      mail: "",
      photo: "",
      rfid: "",
      students: [],
    };
  },
  mounted() {
    campusdb.getStudents().then((res) => (this.students = res.data));
  },
  methods: {
    removeStudent(index) {
      try {
        if (!confirm("CONFIRMAR: Eliminar estudiante")) return;
        this.students.splice(index, 1);
        //llamar API para borrar estudiante
      } catch (error) {
        console.log(error);
        this.error = true;
      }
    },
    addStudent() {
      // ...
    },
    editStudent() {
      // ...
    }
  },
};
</script>