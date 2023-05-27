<template>
    <div id="app" class="locations">
      <h1 class="text-4xl font-bold text-gray-800">Lista de ubicaciones</h1>
      <button
          class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
          @click="addLocation"
        >
          Añadir ubicación
        </button>
      <table class="w-full">
        <thead class="bg-gray-50 border-b-2 border-gray-200">
          <tr>
            <th class="p-4 text-sm font-semibold tracking-wide text-left">Nº</th>
            <th class="p-4 text-sm font-semibold tracking-wide text-left">Nombre</th>
            <th class="p-4 text-sm font-semibold tracking-wide text-left">Reconocimiento facial</th>
            <th class="p-4 text-sm font-semibold tracking-wide text-left">RFID</th>
            <th class="p-4 text-sm font-semibold tracking-wide text-left">Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="bg-gray-50"
            v-for="(location, index) in locations"
            v-bind:key="location"
          >
            <td class="p-4 text-sm text-gray-700">{{ location.id }}</td>
            <td class="p-4 text-sm text-gray-700">{{ location.locationName }}</td>
            <td class="p-4 text-sm text-gray-700">{{ location.facialRecognitionRequired ? 'Sí' : 'No' }}</td>
            <td class="p-4 text-sm text-gray-700">{{ location.rfidRequired ? 'Sí' : 'No' }}</td>
            <td class="p-4 text-sm text-gray-700">
              <button
                class="bg-cyan-800 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full mr-2"
                @click="editLocation(index)"
              >
                Editar
              </button>
              <button
                class="bg-red-800 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full"
                @click="removeLocation(index)"
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
        fields: ["id", "locationName", "facialRecognitionRequired", "rfidRequired", "action"],
        id: "",
        locationName: "",
        facialRecognitionRequired: "",
        rfidRequired: "",
        locations: [],
      };
    },
    mounted() {
      campusdb.getLocations().then((res) => (this.locations = res.data));
    },
    methods: {
      removeLocation(index) {
        try {
          if (!confirm("CONFIRMAR: Eliminar ubicación")) return;
          this.locations.splice(index, 1);
          //llamar API para borrar ubicación
        } catch (error) {
          console.log(error);
          this.error = true;
        }
      },
      addLocation() {
        // ...
      },
      editLocation() {
        // ...
      }
    },
  };
  </script>