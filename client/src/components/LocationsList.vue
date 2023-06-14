<template>
  <div id="app">
    <div class="locations">
      <div class="flex items-center mb-7 ">
        <h1 class="text-4xl font-bold text-gray-800 mt-4">Lista de ubicaciones</h1>
        <button
          class="bg-transparent hover:bg-green-100 text-green-500 font-bold py-2 px-4 rounded-full mr-4 outline-none border-2 border-green-500 transition-colors duration-300 ring-green-500 ring-offset-2"
          style="margin-left: 1%;" @click="showAddLocationForm = true">
          + Añadir ubicación
        </button>
      </div>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full border border-gray-200 divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="p-4 text-sm font-semibold tracking-wide text-left w-1/12">Nº</th>
            <th class="p-4 text-sm font-semibold tracking-wide text-left w-4/12">Nombre</th>
            <th class="p-4 text-sm font-semibold tracking-wide text-left w-1/12">Reconocimiento facial</th>
            <th class="p-4 text-sm font-semibold tracking-wide text-left w-1/12">RFID</th>
            <th class="p-4 text-sm font-semibold tracking-wide text-left w-5/12">Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="showAddLocationForm" class="bg-white divide-x divide-gray-200">
            <td class="p-4 text-sm text-gray-700">{{ locations.length + 1 }}</td>
            <td class="p-4 text-sm text-gray-700">
              <input type="text" v-model="newLocation.locationName" />
            </td>
            <td class="p-4 text-sm text-gray-700">
              <input type="checkbox" v-model="newLocation.facialRecognitionRequired" />
            </td>
            <td class="p-4 text-sm text-gray-700">
              <input type="checkbox" v-model="newLocation.rfidRequired" />
            </td>
            <td class="p-4 text-sm text-gray-700">
              <div class="flex space-x-2">
                <button @click="addLocation"
                  class="bg-green-800 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-1">
                  + Añadir
                </button>
                <button @click="showAddLocationForm = false"
                  class="bg-red-800 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-1">
                  Cancelar
                </button>
              </div>
            </td>
          </tr>
          <tr v-for="(location, index) in locations" v-bind:key="location" class="bg-white divide-x divide-gray-200">
            <td class="p-4 text-sm text-gray-700">{{ location.id }}</td>
            <td class="p-4 text-sm text-gray-700">
              <template v-if="location.editable">
                <input type="text" v-model="location.locationName" />
              </template>
              <template v-else>{{ location.locationName }}</template>
            </td>
            <td class="p-4 text-sm text-gray-700">
              <template v-if="location.editable">
                <input type="checkbox" v-model="location.facialRecognitionRequired" />
              </template>
              <template v-else>
                <span>{{ location.facialRecognitionRequired ? 'Sí' : 'No' }}</span>
              </template>
            </td>
            <td class="p-4 text-sm text-gray-700">
              <template v-if="location.editable">
                <input type="checkbox" v-model="location.rfidRequired" />
              </template>
              <template v-else>
                <span>{{ location.rfidRequired ? 'Sí' : 'No' }}</span>
              </template>
            </td>
            <td class="p-4 text-sm text-gray-700">
              <div class="flex space-x-2">
                <template v-if="location.editable">
                  <button
                    class="bg-green-800 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-1"
                    @click="saveLocation(location)">
                    Guardar
                  </button>
                  <button
                    class="bg-red-800 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-1"
                    @click="cancelEditLocation(location)">
                    Cancelar
                  </button>
                </template>
                <template v-if="!location.editable">
                  <button
                    class="bg-cyan-800 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-1"
                    @click="editLocation(location)">
                    <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="h-4 w-4">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125">
                      </path>
                    </svg>
                    <span>Editar</span>
                  </button>
                  <button
                    class="bg-red-800 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-1 mr-2"
                    @click="removeLocation(index)">
                    <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="h-4 w-4">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0">
                      </path>
                    </svg>
                    <span>Eliminar</span>
                  </button>
                  <button
                    class="bg-green-800 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-1 mr-2"
                    @click="syncWithIdentificationSystems(location.id)">
                    <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="h-4 w-4">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244">
                      </path>
                    </svg>
                    <span> Sync</span>
                  </button>
                </template>
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
      fields: ["id", "locationName", "facialRecognitionRequired", "rfidRequired", "action"],
      id: "",
      locationName: "",
      facialRecognitionRequired: "",
      rfidRequired: "",
      originalLocation: null,
      locations: [],
      showAddLocationForm: false,
      newLocation: {
        locationName: "",
        facialRecognitionRequired: false,
        rfidRequired: false,
      },
    };
  },
  mounted() {
    campusdb.getLocations().then((res) => (this.locations = res.data));
  },
  methods: {
    removeLocation(index) {
      try {
        if (!confirm("CONFIRMAR: Eliminar ubicación")) return;
        const locationId = this.locations[index].id;
        campusdb.deleteLocation(locationId).then(() => {
          this.locations.splice(index, 1);
        });
        //llamar API para borrar ubicación
      } catch (error) {
        console.log(error);
      }
    },
    addLocation() {
      const newLocation = {
        id: this.locations.length + 1,
        ...this.newLocation,
        editable: false,
      };
      this.locations.push(newLocation);
      campusdb.addLocation(newLocation).then(() => {
        this.newLocation = {
          locationId: "",
          locationName: "",
          facialRecognitionRequired: false,
          rfidRequired: false,
        };
        this.showAddLocationForm = false;
      }).catch((error) => {
        console.error("Error adding location", error)
      });
    },
    editLocation(location) {
      this.originalLocation = { ...location }
      location.editable = true;
      location.facialRecognitionRequired = location.facialRecognitionRequired > 0;
      location.rfidRequired = location.rfidRequired > 0;
    },
    saveLocation(location) {
      campusdb.updateLocation(location)
        .then(() => {
          location.editable = false;
        })
        .catch((error) => {
          console.error("Error updating location", error)
        });
      // locations.editable = false;
    },
    cancelEditLocation(location) {
      Object.assign(location, this.originalLocation);
      location.editable = false;
    },
    syncWithIdentificationSystems(location) {
      campusdb.sendSyncData(location)
        .then(() => {
          alert("Sincronización con sistemas de identificación completada");
        })
        .catch((error) => {
          console.error("Error sending sync data", error)
        });
    }
  },
};
</script>
  