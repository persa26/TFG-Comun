<template>
  <div id="app" class="locations">
    <h1 class="text-4xl font-bold text-gray-800">Lista de ubicaciones</h1>
    <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
      @click="showAddLocationForm = true">
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
        <tr v-if="showAddLocationForm" class="bg-gray-50">
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
            <button @click="addLocation"
              class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded-full mr-2">
              Añadir
            </button>
            <button @click="showAddLocationForm = false"
              class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-full">
              Cancelar
            </button>
          </td>
        </tr>
        <tr class="bg-gray-50" v-for="(location, index) in locations" v-bind:key="location">
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
            <template v-if="location.editable">
              <button
                class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full mr-2"
                @click="saveLocation(location)">
                Guardar
              </button>
              <button
                class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
                @click="cancelEditLocation(location)">
                Cancelar
              </button>
            </template>
            <template v-if="!location.editable">
              <button 
                class="bg-cyan-800 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-full mr-2"
                @click="editLocation(location)">
                Editar
              </button>
              <button 
                class="bg-red-800 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-full mr-2"
                @click="removeLocation(index)">
                Eliminar
              </button>
              <button 
                class="bg-green-800 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-full"
                @click="syncWithIdentificationSystems(location.id)">
                Sync
              </button>
            </template>
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
  