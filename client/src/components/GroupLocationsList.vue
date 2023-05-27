<template>
    <div id="app" class="groupLocations">
      <h1 class="text-4xl font-bold text-gray-800">Lista de ubicaciones de grupos</h1>
      <button
          class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
          @click="addGroupLocation"
        >
          Añadir ubicación de grupo
        </button>
      <table class="w-full">
      <thead class="bg-gray-50 border-b-2 border-gray-200">
        <tr>
          <th class="p-4 text-sm font-semibold tracking-wide text-left">Nº</th>
          <th class="p-4 text-sm font-semibold tracking-wide text-left">ID de grupo</th>
          <th class="p-4 text-sm font-semibold tracking-wide text-left">ID de ubicación</th>
          <th class="p-4 text-sm font-semibold tracking-wide text-left">Hora de entrada</th>
          <th class="p-4 text-sm font-semibold tracking-wide text-left">Hora de salida</th>
          <th class="p-4 text-sm font-semibold tracking-wide text-left">Acción</th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="bg-gray-50"
          v-for="(groupLocation, index) in groupLocations"
          v-bind:key="groupLocation"
        >
          <td class="p-4 text-sm text-gray-700">{{ groupLocation.id }}</td>
          <td class="p-4 text-sm text-gray-700">{{ groupLocation.groupId }}</td>
          <td class="p-4 text-sm text-gray-700">{{ groupLocation.locationId }}</td>
          <td class="p-4 text-sm text-gray-700">{{ groupLocation.entryTime }}</td>
          <td class="p-4 text-sm text-gray-700">{{ groupLocation.exitTime }}</td>
          <td class="p-4 text-sm text-gray-700">
            <button
              class="bg-cyan-800 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full mr-2"
              @click="editGroupLocation(index)"
            >
              Editar
            </button>
            <button
              class="bg-red-800 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full"
              @click="removeGroupLocation(index)"
            >
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
      fields: ["id", "groupId", "locationId", "entryTime", "exitTime", "action"],
      id: "",
      groupId: "",
      locationId: "",
      entryTime: "",
      exitTime: "",
      groupLocations: [],
    };
  },
  mounted() {
    campusdb.getGroupLocations().then((res) => (this.groupLocations = res.data));
  },
  methods: {
    removeGroupLocation(index) {
      try {
        if (!confirm("CONFIRMAR: Eliminar ubicación de grupo")) return;
        this.groupLocations.splice(index, 1);
        //llamar API para borrar ubicación de grupo
      } catch (error) {
        console.log(error);
        this.error = true;
      }
    },
    addGroupLocation() {
      // ...
    },
    editGroupLocation() {
      // ...
    }
  },
};
</script>
