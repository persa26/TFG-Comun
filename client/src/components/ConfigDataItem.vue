<template>
  <div class="config-item">
    <h2 class="text-2xl font-bold text-gray-800">{{ title }}</h2>
    <div class="flex items-center">
      <label class="w-48 font-bold" for="ip">Dirección IP:</label>
      <input v-model="localConfig.IP" class="border rounded p-2 w-64" id="ip" @input="updateConfig" />
    </div>
    <div class="flex items-center">
      <label class="w-48 font-bold" for="port">Puerto:</label>
      <input v-model="localConfig.port" class="border rounded p-2 w-64" id="port" @input="updateConfig" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    config: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      localConfig: {},
    };
  },
  watch: {
    config: {
      immediate: true,
      handler(newConfig) {
        this.localConfig = { ...newConfig };
      },
    },
  },
  methods: {
    updateConfig() {
      this.$emit('config-updated', this.localConfig);
    },
  },
};
</script>

<style scoped>
.config-item {
  margin-bottom: 1rem;
}
</style>
