<template>
  <div id="app">
    <div class="users">
      <div class="flex items-center mb-7 ">

        <h1 class="text-4xl font-bold text-gray-800 mt-4">
          Lista de estudiantes
        </h1>
        <button
          class="bg-transparent hover:bg-green-100 text-green-500 font-bold py-2 px-4 rounded-full mr-4 outline-none border-2 border-green-500 transition-colors duration-300 ring-green-500 ring-offset-2"
          style="margin-left: 1%;" @click="showAddStudentForm = true">
          + Añadir estudiante
        </button>
      </div>
    </div>
  </div>
  <div class="overflow-x-auto">
    <table class="w-full border border-gray-200 divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="p-4 text-sm font-semibold tracking-wide text-left w-1/12">Nº</th>
          <th class="p-4 text-sm font-semibold tracking-wide text-left w-1/12">Imagen</th>
          <th class="p-4 text-sm font-semibold tracking-wide text-left w-1/12">Name</th>
          <th class="p-4 text-sm font-semibold tracking-wide text-left w-2/12">Surname</th>
          <th class="p-4 text-sm font-semibold tracking-wide text-left w-2/12">Mail</th>
          <th class="p-4 text-sm font-semibold tracking-wide text-left w-1/12">RFID</th>
          <th class="p-4 text-sm font-semibold tracking-wide text-left w-4/12">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="showAddStudentForm" class="bg-white divide-x divide-gray-200">
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
            <div class="flex space-x-2">
              <button
                class="bg-green-800 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-1"
                @click="addStudent">+ Añadir</button>
              <button @click="showAddStudentForm = false"
                class="bg-red-800 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-1">
                Cancelar
              </button>
            </div>
          </td>
        </tr>

        <tr v-for="(student, index) in students" v-bind:key="student" :class="{ 'bg-gray-50': index % 2 === 0 }"
          class="bg-white divide-x divide-gray-200">
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
            <div class="flex space-x-2">
              <button v-if="student.editing"
                class="bg-green-800 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-1"
                @click="saveStudent(index)">
                Guardar
              </button>
              <button v-if="student.editing"
                class="bg-red-800 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-1"
                @click="cancelEditStudent(index)">
                Cancelar
              </button>
              <button v-else
                class="bg-cyan-800 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-1"
                @click="editStudent(index)">
                <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="h-4 w-4">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125">
                  </path>
                </svg>
                <span class="ml-1">Editar</span>
              </button>
              <button v-if="!student.editing"
                class="bg-red-800 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-1"
                @click="removeStudent(index)">
                <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="h-4 w-4">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0">
                  </path>
                </svg>
                <span>Eliminar</span>
              </button>
              <button
                class="bg-green-800 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-1"
                @click="openUploadModal(index)">
                <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="h-4 w-4">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z">
                  </path>
                </svg>
                <span class="ml-1">Subir imagen</span>
              </button>

              <div v-if="showUploadModal" class="modal">
                <div class="modal-content">
                  <span class="close" @click="showUploadModal = false">×</span>
                  <h2>Subir imagen</h2>
                  <input type="file" ref="fileInput" />
                  <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                    @click="uploadImage()">Enviar</button>
                </div>
              </div>

              <button
                class="bg-blue-800 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-1"
                @click="getUserImages(student.id)">
                <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="h-4 w-4">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z">
                  </path>
                </svg>
                <span>Ver imágenes</span>
              </button>
            </div>

            <div v-if="showImageModal" class="modal">
              <div class="modal-content">
                <span class="close" @click="showImageModal = false">×</span>
                <h2>Imágenes del usuario</h2>
                <div class="image-grid">
                  <div v-for="image in userImages" :key="image.id" class="image-container">
                    <img :src="image.url" alt="User image" class="image" :class="{ 'selected': isSelectedImage(image) }"
                      @click="toggleImageSelection(image)">
                  </div>
                </div>
                <button v-if="selectedImages.length > 0" class="delete-image-button"
                  @click="removeSelectedImages">Eliminar</button>
              </div>
            </div>
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
      students: [],
      showAddStudentForm: false,
      showUploadModal: false,
      uploadImages: [],
      uploadedImages: [],
      selectedImages: [],
      userImages: [],
      showImageModal: false,
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
      const newStudent = {
        id: this.students.length + 1,
        ...this.newStudent,
        editing: false,
        photo: "https://i.pravatar.cc/100?u=" + Date.now()
      };

      this.students.unshift(newStudent);
      campusdb.addStudent(newStudent).then(() => {
        this.newStudent = {
          name: '',
          surname: '',
          mail: '',
          rfid: '',
        };
        this.showAddStudentForm = false;
      }).catch((error) => { console.error(error); });
    },

    removeStudent(index) {
      if (!confirm("CONFIRMAR: Eliminar estudiante")) return;
      const studentId = this.students[index].id;
      campusdb.deleteStudent(studentId).then(() => {
        this.students.splice(index, 1);
      })
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

    openUploadModal(index) {
      this.currentStudentIndex = index;
      this.showUploadModal = true;
    },
    // handleFileChange(event) {
    //   const selectedFiles = event.target.files;
    //   console.log(selectedFiles);
    // },
    uploadImage() {
      const file = this.$refs.fileInput[this.students.length - 1].files[0];
      const newImage = {
        file,
        url: URL.createObjectURL(file),
      };
      this.uploadImages.push(newImage);
      this.showUploadModal = false;
      campusdb.postRecognitionImage(this.students[this.currentStudentIndex].id, file).then(() => {
        this.uploadedImages.push(newImage);

      }).catch((error) => { console.error(error); });
    },

    getUserImages(userId) {
      campusdb.getUserImages(userId)
        .then((res) => {
          this.userImages = res.data.rows;
          this.userImages.forEach((image) => {
            image.url = `http://localhost:3080/api/v1/students/imageurl/${image.imageLocation}`

          });
          this.showImageModal = true;
        })
        .catch((error) => { console.error(error); });
    },
    isSelectedImage(image) {
      return this.selectedImages.includes(image);
    },

    toggleImageSelection(image) {
      if (this.isSelectedImage(image)) {
        const index = this.selectedImages.indexOf(image);
        this.selectedImages.splice(index, 1);
      } else {
        this.selectedImages.push(image);
      }
    },

    removeSelectedImages() {
      if (!confirm("CONFIRMAR: Eliminar imágenes")) return;
      this.selectedImages.forEach((image) => {
        campusdb.deleteRecognitionImage(image.id).then(() => {
          const index = this.userImages.indexOf(image);
          this.userImages.splice(index, 1);
        })
      });
    }
  },
};
</script>
<style>
.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 50%;
  max-width: 500px;
  font-family: Arial, sans-serif;
  font-size: 18px;
  color: #333;
  border-radius: 10px;
}

.modal-content h2 {
  font-size: 24px;
  margin-bottom: 20px;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.image-container {
  width: 100%;
  max-width: 300px;
  margin-bottom: 10px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.image-container {
  width: 100%;
  max-width: 300px;
  margin-bottom: 10px;
}

.image {
  width: 100%;
  height: auto;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.image.selected {
  border: 2px solid #ff0000;
  box-shadow: 0 0 5px #ff0000;
}

.delete-image-button {
  background-color: #ff0000;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  margin-top: 20px;
  float: right;
}


.modal-button {
  background-color: #ff0000;
  color: white;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  margin-top: 20px;
  border-radius: 5px;
}
</style>
