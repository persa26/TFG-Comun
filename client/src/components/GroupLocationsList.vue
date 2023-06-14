<template>
  <div id="app">
    <div class="groupLocations">
      <div class="flex items-center mb-7 ">
        <h1 class="text-4xl font-bold text-gray-800 mt-4">
          Lista de ubicaciones de grupos
        </h1>
        <button c
          class="bg-transparent hover:bg-green-100 text-green-500 font-bold py-2 px-4 rounded-full mr-4 outline-none border-2 border-green-500 transition-colors duration-300 ring-green-500 ring-offset-2"
          style="margin-left: 1%;" @click="showAddGroupLocationForm = true">
          + Añadir ubicación de grupo
        </button>
      </div>
    </div>
    <table class="w-full border border-gray-200 divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="p-4 text-sm font-semibold tracking-wide text-left w-1/12">Nº</th>
          <th class="p-4 text-sm font-semibold tracking-wide text-left w-3/12"> Nombre del grupo</th>
          <th class="p-4 text-sm font-semibold tracking-wide text-left w-3/12"> Nombre de la ubicación</th>
          <th class="p-4 text-sm font-semibold tracking-wide text-left w-1/12"> Hora de entrada</th>
          <th class="p-4 text-sm font-semibold tracking-wide text-left w-1/12"> Hora de salida </th>
          <th class="p-4 text-sm font-semibold tracking-wide text-left w-3/12"> Acción</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="showAddGroupLocationForm" class="bg-white divide-x divide-gray-200">
          <td class="p-4 text-sm text-gray-700">{{ groupLocations.length + 1 }}</td>
          <td class="p-4 text-sm text-gray-700">
            <select v-model="newGroupLocation.groupId">
              <option v-for="group in groups" :value="group.id" :key="group.id">{{
                group.name
              }}</option>
            </select>
          </td>
          <td class="p-4 text-sm text-gray-700">
            <select v-model="newGroupLocation.locationId">
              <option v-for="location in locations" :value="location.id" :key="location.id">
                {{ location.locationName }}
              </option>
            </select>
          </td>
          <td class="p-4 text-sm text-gray-700">
            <template v-if="showAddGroupLocationForm">
              <select v-model="newGroupLocation.entryTime">
                <option v-for="time in timeOptions" :value="time" :key="time">{{ time }}</option>
              </select>
            </template>
          </td>
          <td class="p-4 text-sm text-gray-700">
            <template v-if="showAddGroupLocationForm">
              <select v-model="newGroupLocation.exitTime">
                <option v-for="time in timeOptions" :value="time" :key="time">{{ time }}</option>
              </select>
            </template>
          </td>
          <td class="p-4 text-sm text-gray-700">
            <div class="flex space-x-2">
              <button @click="addGroupLocation"
                class="bg-green-800 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-1">
                + Añadir
              </button>
              <button @click="showAddGroupLocationForm = false"
                class="bg-red-800 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-1">
                Cancelar
              </button>
            </div>
          </td>
        </tr>
        <tr v-for="(groupLocation, index) in groupLocations" :key="groupLocation.id"
          class="bg-white divide-x divide-gray-200">
          <td class="p-4 text-sm text-gray-700">{{ groupLocation.id }}</td>
          <td class="p-4 text-sm text-gray-700">
            <template v-if="groupLocation.editable">
              <select v-model="groupLocation.groupId">
                <option v-for="group in groups" :value="group.id" :key="group.id">{{
                  group.name
                }}</option>
              </select>
            </template>
            <template v-else>{{ getGroupName(groupLocation.groupId) }}</template>
          </td>
          <td class="p-4 text-sm text-gray-700">
            <template v-if="groupLocation.editable">
              <select v-model="groupLocation.locationId">
                <option v-for="location in locations" :value="location.id" :key="location.id">
                  {{ location.locationName }}
                </option>
              </select>
            </template>
            <template v-else>{{ getLocationName(groupLocation.locationId) }}</template>
          </td>

          <td class="p-4 text-sm text-gray-700">
            <template v-if="groupLocation.editable">
              <select v-model="groupLocation.entryTime">
                <option v-for="time in timeOptions" :value="time" :key="time">{{ time }}</option>
              </select>
            </template>
            <template v-else>{{ groupLocation.entryTime }}</template>
          </td>
          <td class="p-4 text-sm text-gray-700">
            <template v-if="groupLocation.editable">
              <select v-model="groupLocation.exitTime">
                <option v-for="time in timeOptions" :value="time" :key="time">{{ time }}</option>
              </select>
            </template>
            <template v-else>{{ groupLocation.exitTime }}</template>
          </td>

          <td class="p-4 text-sm text-gray-700">
            <div class="flex space-x-2">

              <template v-if="groupLocation.editable">
                <button
                  class="bg-green-800 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-1"
                  @click="saveGroupLocation(groupLocation)">
                  Guardar
                </button>
              </template>
              <button v-if="groupLocation.editable"
                class="bg-red-800 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-1"
                @click="cancelEditGroupLocation(groupLocation)">
                Cancelar
              </button>
              <template v-else>
                <button
                  class="bg-cyan-800 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-1"
                  @click="editGroupLocation(groupLocation)"> <svg fill="none" stroke="currentColor" stroke-width="1.5"
                    viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="h-4 w-4">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125">
                    </path>
                  </svg>
                  <span>Editar</span>
                </button>
              </template>
              <button v-if="!groupLocation.editable"
                class="bg-red-800 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-1 mr-2"
                @click="removeGroupLocation(index)">
                <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="h-4 w-4">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0">
                  </path>
                </svg>
                <span>Eliminar</span>
              </button>
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
      fields: ["id", "groupId", "locationId", "entryTime", "exitTime", "action"],
      id: "",
      groupId: "",
      locationId: "",
      entryTime: "",
      exitTime: "",
      groupLocations: [],
      locations: [],
      groups: [],
      originalGroupLocation: null,
      showAddGroupLocationForm: false,
      newGroupLocation: {
        groupId: "",
        locationId: "",
        entryTime: "",
        exitTime: "",
      },
      timeOptions: [],
    };
  },
  mounted() {
    this.fetchData();
    this.generateTimeOptions();
  },
  methods: {
    fetchData() {
      Promise.all([
        campusdb.getGroupLocations(),
        campusdb.getLocations(),
        campusdb.getGroups(),
      ])
        .then(([groupLocationsRes, locationsRes, groupsRes]) => {
          this.groupLocations = groupLocationsRes.data;
          this.locations = locationsRes.data;
          this.groups = groupsRes.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    removeGroupLocation(index) {
      try {
        if (!confirm("CONFIRMAR: Eliminar ubicación de grupo")) return;
        const groupLocationId = this.groupLocations[index].id;
        campusdb.deleteGroupLocation(groupLocationId).then(() => {
          this.groupLocations.splice(index, 1);
        });
      } catch (error) {
        console.log(error);
      }
    },
    getGroupName(groupId) {
      const group = this.groups.find((group) => group.id === groupId);
      return group ? group.name : "";
    },
    getLocationName(locationId) {
      const location = this.locations.find((location) => location.id === locationId);
      return location ? location.locationName : "";
    },
    addGroupLocation() {
      const newGroupLocation = {
        id: this.groupLocations.length + 1,
        ...this.newGroupLocation,
        editable: false,
      };
      this.groupLocations.unshift(newGroupLocation);
      campusdb.addGroupLocation(newGroupLocation).then(() => {
        this.newGroupLocation = {
          groupId: "",
          locationId: "",
          entryTime: "",
          exitTime: "",
        };
        this.showAddGroupLocationForm = false;
      }).catch((error) => {
        console.log(error);
      });
    },
    editGroupLocation(groupLocation) {
      this.originalGroupLocation = { ...groupLocation };
      groupLocation.editable = true;
    },
    saveGroupLocation(groupLocation) {
      campusdb.updateGroupLocation(groupLocation)
        .then(() => {
          groupLocation.editable = false;
        })
        .catch((error) => {
          console.error("Error al guardar la ubicación de grupo:", error);
        });
    },
    cancelEditGroupLocation(groupLocation) {
      Object.assign(groupLocation, this.originalGroupLocation);
      groupLocation.editable = false;
    },
    generateTimeOptions() {
      for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
          const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
          this.timeOptions.push(timeString);
        }
      }
    },
  },

};
</script>
