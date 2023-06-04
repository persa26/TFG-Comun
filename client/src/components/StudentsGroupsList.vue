<template>
  <div id="app" class="studentsGroups">
    <h1 class="text-4xl font-bold text-gray-800">
      Lista de estudiantes por grupo
    </h1>
    <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
      @click="showAddGroupLocationForm = true">
      Añadir ubicación de grupo
    </button>
    <table class="w-full">
      <thead class="bg-gray-50 border-b-2 border-gray-200">
        <tr>
          <th class="p-4 text-sm font-semibold tracking-wide text-left">Nº</th>
          <th class="p-4 text-sm font-semibold tracking-wide text-left">
            Nombre del grupo
          </th>
          <th class="p-4 text-sm font-semibold tracking-wide text-left">
            Nombre de la ubicación
          </th>
          <th class="p-4 text-sm font-semibold tracking-wide text-left">
            Hora de entrada
          </th>
          <th class="p-4 text-sm font-semibold tracking-wide text-left">
            Hora de salida
          </th>
          <th class="p-4 text-sm font-semibold tracking-wide text-left">Acción</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="showAddGroupLocationForm" class="bg-gray-50">
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
            <button @click="addGroupLocation"
              class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded-full mr-2">
              Añadir
            </button>
            <button @click="showAddGroupLocationForm = false"
              class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-full">
              Cancelar
            </button>
          </td>
        </tr>
        <tr class="bg-gray-50" v-for="(groupLocation, index) in groupLocations" :key="groupLocation.id">
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
            <template v-if="groupLocation.editable">
              <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full mr-2"
                @click="saveGroupLocation(groupLocation)">
                Guardar
              </button>
            </template>
            <template v-else>
              <button class="bg-cyan-800 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full mr-2"
                @click="editGroupLocation(groupLocation)">
                Editar
              </button>
            </template>
            <button v-if="!groupLocation.editable"
              class="bg-red-800 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full"
              @click="removeGroupLocation(index)">
              Eliminar
            </button>
            <button v-if="groupLocation.editable"
              class="bg-red-800 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full"
              @click="cancelEditGroupLocation(groupLocation)">
              Cancelar
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
