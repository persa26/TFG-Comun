<template class="w-full">
  <div id="app" class="users w-full">
    <h1 class="text-4xl font-bold text-gray-800">Lista de estudiantes</h1>
    <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
      @click="showAddStudentForm = true">
      Añadir estudiante
    </button>
    <table class="w-full mt-4">
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
        <tr v-if="showAddStudentForm" class="bg-gray-50">
          <td class="p-4 text-sm text-gray-700">{{ students.length + 1 }}</td>
          <td class="p-4 text-sm text-gray-700"></td>
          <td class="p-4 text-sm text-gray-700">
            <input type="text" v-model="newStudent.name" class="border border-gray-300 rounded-md p-1" />
          </td>
          <td class="p-4 text-sm text-gray-700">
            <input type="text" v-model="newStudent.surname" class="border border-gray-300 rounded-md p-1" />
          </td>
          <td class="p-4 text-sm text-gray-700">
            <input type="email" v-model="newStudent.mail" class="border border-gray-300 rounded-md p-1" />
          </td>
          <td class="p-4 text-sm text-gray-700">
            <input type="text" v-model="newStudent.rfid" class="border border-gray-300 rounded-md p-1" />
          </td>
          <td class="p-4 text-sm text-gray-700">
            <button @click="addStudent"
              class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded-full mr-2">Añadir</button>
            <button @click="showAddStudentForm = false"
              class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-full">Cancelar</button>
          </td>
        </tr>

        <tr v-for="(student, index) in students" v-bind:key="student" :class="{ 'bg-gray-50': index % 2 === 0 }">
          <td class="p-4 text-sm text-gray-700">{{ student.id }}</td>
          <td v-if="student.photo" class="p-4 text-sm text-gray-700 rounded-full h-12 w-12 mr-2"><img :src="student.photo"
              alt="User image"></td>
          <td v-else class="p-2 h-12 w-12 mr-2"><img src="https://i.pravatar.cc/100" alt="User image"></td>
          <td v-if="student.editing" class="p-4 text-sm text-gray-700">
            <input type="text" v-model="student.name" />
          </td>
          <td v-else class="p-4 text-sm text-gray-700">{{ student.name }}</td>
          <td v-if="student.editing" class="p-4 text-sm text-gray-700">
            <input type="text" v-model="student.surname" />
          </td>
          <td v-else class="p-4 text-sm text-gray-700">{{ student.surname }}</td>
          <td v-if="student.editing" class="p-4 text-sm text-gray-700">
            <input type="text" v-model="student.mail" />
          </td>
          <td v-else class="p-4 text-sm text-gray-700">{{ student.mail }}</td>
          <td v-if="student.editing" class="p-4 text-sm text-gray-700">
            <input type="text" v-model="student.rfid" />
          </td>
          <td v-else class="p-4 text-sm text-gray-700">{{ student.rfid }}</td>
          <td class="p-4 text-sm text-gray-700">
            <button v-if="student.editing"
              class="bg-green-800 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full mr-2"
              @click="saveStudent(index)">
              Guardar
            </button>
            <button v-if="student.editing"
              class="bg-red-800 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full mr-2"
              @click="cancelEditStudent(index)">
              Cancelar
            </button>
            <button v-else class="bg-cyan-800 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full mr-2"
              @click="editStudent(index)">
              Editar
            </button>
            <button v-if="!student.editing"
              class="bg-red-800 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full"
              @click="removeStudent(index)">
              Eliminar
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
      showAddStudentForm: false,
      newStudent: {
        name: '',
        surname: '',
        mail: '',
        rfid: '',
      },
    };
  },
  mounted() {
    campusdb.getStudents().then((res) => (this.students = res.data));
  },
  methods: {
    addStudent() {
      // Create a new student object with the entered information
      const newStudent = {
        id: this.students.length + 1,
        ...this.newStudent,
        editing: false,
        photo: "https://i.pravatar.cc/100?u=" + Date.now() // Generate a random avatar URL
      };

      // Add the new student to the beginning of the list
      this.students.unshift(newStudent);
      console.log("newStudent", newStudent)

      // Call the API to add the new student to the database
      campusdb.addStudent(newStudent).then(() => {
        // Handle successful addition of the new student
        // Reset the new student form
        this.newStudent = {
          name: '',
          surname: '',
          mail: '',
          rfid: '',
        };
        this.showAddStudentForm = false;
      }).catch((error) => {
        console.log(error);
        // Handle error while adding the new student
      });
    },

    removeStudent(index) {
      try {
        if (!confirm("CONFIRMAR: Eliminar estudiante")) return;
        const studentId = this.students[index].id;
        campusdb.deleteStudent(studentId).then(() => {
          this.students.splice(index, 1);
        })
      } catch (error) {
        console.log(error);
      }
    },
    editStudent(index) {
      this.students[index].editing = true;

      const properties = ['name', 'surname', 'mail', 'rfid'];
      for (const prop of properties) {
        this.students[index]['original' + prop.charAt(0).toUpperCase() + prop.slice(1)] = this.students[index][prop];
      }
    },
    saveStudent(index) {
      this.students[index].editing = false;

      const { id: studentId, name: studentName, surname: studentSurname, mail: studentMail, rfid: studentRfid } = this.students[index];

      campusdb.updateStudent(studentId, studentName, studentSurname, studentMail, studentRfid).then(() => {
        // Actualizar los datos del estudiante en la lista
        this.students[index].name = studentName;
        this.students[index].surname = studentSurname;
        this.students[index].mail = studentMail;
        this.students[index].rfid = studentRfid;
      });
    },
    cancelEditStudent(index) {
      this.students[index].editing = false;

      const properties = ['name', 'surname', 'mail', 'rfid'];
      for (const prop of properties) {
        this.students[index][prop] = this.students[index]['original' + prop.charAt(0).toUpperCase() + prop.slice(1)];
      }
    },
  },
};
</script>
