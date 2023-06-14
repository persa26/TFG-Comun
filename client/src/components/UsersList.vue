<template>
  <div id="app" class="users">
    <div class="studentsGroups">
      <div class="flex items-center mb-7 ">
        <h1 class="text-4xl font-bold text-gray-800 mt-4">
          Lista de Usuarios
        </h1>
        <button
          class="bg-transparent hover:bg-green-100 text-green-500 font-bold py-2 px-4 rounded-full mr-4 outline-none border-2 border-green-500 transition-colors duration-300 ring-green-500 ring-offset-2"
          style="margin-left: 1%;" @click="addUser">
          + Añadir usuario
        </button>
      </div>
    </div>
    <div class="overflow-x-auto"></div>
    <table class="w-full border border-gray-200 divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="p-4 text-sm font-semibold tracking-wide text-left w-1/12"> Nº </th>
          <th class="p-4 text-sm font-semibold tracking-wide text-left w-1/12"> Imagen </th>
          <th class="p-4 text-sm font-semibold tracking-wide text-left w-4/12"> Name </th>
          <th class="p-4 text-sm font-semibold tracking-wide text-left w-4/12"> Surname </th>
          <th class="p-4 text-sm font-semibold tracking-wide text-left w-1/12"> Mail </th>
          <th class="p-4 text-sm font-semibold tracking-wide text-left w-1/12"> Action </th>
        </tr>
      </thead>
      <tbody>
        <tr class="bg-white divide-x divide-gray-200" v-for="(usuario, index) in usuarios" v-bind:key="usuario">
          <td class="p-4 text-sm text-gray-700">{{ usuario.id }}</td>
          <td class="p-4 text-sm text-gray-700"><img :src="usuario.photo" alt="User image" style="max-width: 60px;">
          </td>
          <td class="p-4 text-sm text-gray-700">{{ usuario.name }}</td>
          <td class="p-4 text-sm text-gray-700">{{ usuario.surname }}</td>
          <td class="p-4 text-sm text-gray-700">{{ usuario.mail }}</td>
          <td class="p-4 text-sm text-gray-700">
            <button
              class="bg-red-800 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-1 mr-2"
              @click="eliminar(index)">
              <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="h-4 w-4">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0">
                </path>
              </svg>
              <span>Eliminar</span>
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