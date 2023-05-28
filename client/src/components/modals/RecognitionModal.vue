<template>
    <modal v-model="modalVisible">
      <h2>Imágenes de reconocimiento facial</h2>
      <ul>
        <li v-for="(image, index) in recognitionImages" :key="index">
          <img :src="image" alt="Reconocimiento facial" class="rounded-full h-12 w-12 mr-2">
          <button @click="deleteRecognitionImage(index)" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-full">Eliminar</button>
        </li>
      </ul>
    </modal>
  </template>
  
  <script>
  export default {
    props: {
      recognitionImages: {
        type: Array,
        required: true
      },
      showModal: {
        type: Boolean,
        required: true
      }
    },
    computed: {
      modalVisible: {
        get() {
          return this.showModal;
        },
        set(value) {
          this.$emit('update:showModal', value);
        }
      }
    },
    methods: {
      deleteRecognitionImage(index) {
        this.$emit('delete-image', index);
      }
    }
  }
  </script>
  