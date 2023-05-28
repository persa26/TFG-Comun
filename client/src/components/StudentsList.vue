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
              class="bg-red-800 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full mr-2"
              @click="removeStudent(index)">
              Eliminar
            </button>


            <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full mr-2"
              @click="openUploadModal(index)">Subir imagen</button>

            <div v-if="showUploadModal" class="modal">
              <div class="modal-content">
                <span class="close" @click="showUploadModal = false">×</span>
                <h2>Subir imagen</h2>
                <input type="file" ref="fileInput" />
                <!-- <input type="file" ref="fileInput" @change="handleFileChange" /> -->

                <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                  @click="uploadImage()">Enviar</button>
              </div>
            </div>

            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              @click="getUserImages(student.id)">
              Ver imágenes
            </button>

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
