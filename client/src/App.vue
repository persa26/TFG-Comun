<template>
  <div id="app">
    <div v-if="isAutenticate" class="flex">
      <div class="flex-none p-5">
        <VerticalMenu />
      </div>
      <div class="flex-initial pt-10">
        <router-view></router-view>
      </div>
    </div>
    <LoginView v-if="!isAutenticate" />
  </div>
</template>

<script>
import VerticalMenu from './components/menu/VerticalMenu.vue'
import LoginView from "@/views/LoginView.vue";
import campusdb from "@/services/campusdb";

export default {
  name: "App",
  data: () => ({
    isAutenticate: campusdb.getUserLogged() !== undefined,
  }),
  components: { LoginView, VerticalMenu },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
}



</style>
