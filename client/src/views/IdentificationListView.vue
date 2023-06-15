<template>
    <div class="IdentificationConfig">
      <h1 class="text-4xl font-bold text-gray-800">Configuración</h1>
      <div class="flex flex-wrap">
        <div class="w-full md:w-1/2">
          <ConfigDataItem
            title="Sincronización con reconocimiento facial"
            :config="config.syncIPFaceRecognition || {}"
            @config-updated="updateConfig('syncIPFaceRecognition', $event)"
          />
        </div>
        <div class="w-full md:w-1/2">
          <ConfigDataItem
            title="Sincronización por tarjetas RFID"
            :config="config.syncIPCardID || {}"
            @config-updated="updateConfig('syncIPCardID', $event)"
          />
        </div>
      </div>
      <button
        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full mt-4 mb-7"
        @click="saveConfig"
      >
        Guardar
      </button>
    </div>
    <div class="IdentificationList">
      <IdentificationList />
    </div>
  </template>
  

<script>
import IdentificationList from "@/components/IdentificationList.vue";
import ConfigDataItem from "@/components/ConfigDataItem.vue";
import CampusDB from "@/services/campusdb";

export default {
  name: "IdentificationListView",
  components: {
    IdentificationList,
    ConfigDataItem,
  },
  data() {
    return {
      config: {},
    };
  },
  mounted() {
    this.getConfig();
  },
  methods: {
    getConfig() {
      CampusDB.getConfig()
        .then((res) => {
          this.config = res.data;
        })
        .catch((error) => {
          console.error("Error fetching config", error);
        });
    },
    updateConfig(property, updatedConfig) {
      // Actualizar la propiedad de configuración modificada
      this.config[property] = updatedConfig;
    },
    saveConfig() {
      // Enviar la configuración modificada al servidor
      CampusDB.updateConfig(this.config)
        .then((res) => {
          console.log("Configuración guardada", res.data);
        })
        .catch((error) => {
          console.error("Error al guardar la configuración", error);
        });
    },
  },
};
</script>

<style></style>
