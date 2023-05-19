<template>
  <div id="app" class="users">
    <h1 class="text-4xl font-bold text-gray-800">Lista de Usuarios</h1>
    <button
        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
        @click="addUser"
      >
        Añadir usuario
      </button>
    <table class="w-full">
      <thead class="bg-gray-50 border-b-2 border-gray-200">
        <tr>
          <th class="p-4 text-sm font-semibold tracking-wide text-left">Nº</th>
          <th class="p-4 text-sm font-semibold tracking-wide text-left">Imagen</th>
          <th class="p-4 text-sm font-semibold tracking-wide text-left">Name</th>
          <th class="p-4 text-sm font-semibold tracking-wide text-left">Surname</th>
          <th class="p-4 text-sm font-semibold tracking-wide text-left">Mail</th>
          <th class="p-4 text-sm font-semibold tracking-wide text-left">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="bg-gray-50"
          v-for="(usuario, index) in usuarios"
          v-bind:key="usuario"
        >
          <td class="p-4 text-sm text-gray-700">{{ usuario.id }}</td>
          <td class="p-4 text-sm text-gray-700"><img :src="usuario.imageUrl" alt="User image"></td>
          <td class="p-4 text-sm text-gray-700">{{ usuario.name }}</td>
          <td class="p-4 text-sm text-gray-700">{{ usuario.surname }}</td>
          <td class="p-4 text-sm text-gray-700">{{ usuario.mail }}</td>
          <td class="p-4 text-sm text-gray-700">
            <button
              class="bg-red-800 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full"
              @click="eliminar(index)"
            >
              Delete
            </button>
          </td>
        </tr>
        <tr>
          <td colspan="6">
            <button @click="addUser">Añadir usuario</button>
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
      fields: ["id", "name", "surname", "mail", "action"],
      id: "",
      name: "",
      surname: "",
      mail: "",
      usuarios: [],
    };
  },
  mounted() {
    campusdb.getUsers().then((res) => (this.usuarios = res.data));
  },
  methods: {
    eliminar(index) {
      try {
        if (!confirm("CONFIRMAR: Eliminar usuario")) return;
        this.usuarios.splice(index, 1);
        //llamar API para borrar usuario
      } catch (error) {
        console.log(error);
        this.error = true;
      }
    },
    addUser() {
      // ...
    }
  },
};
</script>