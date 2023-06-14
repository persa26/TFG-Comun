<template>
  <div id="app" class="flex flex-col min-h-screen">
    <div class="flex-grow">
      <div v-if="isAutenticate" class="flex">
        <div class="flex-none p-5">
          <VerticalMenu />
        </div>
        <div class="flex-grow p-4 pt-10">
          <router-view></router-view>
        </div>
      </div>
      <LoginView v-if="!isAutenticate" />
    </div>
    <footer class="py-4 bg-gray-200">
      <div class="container mx-auto text-center text-gray-500">
        &copy; 2023 - EUG
      </div>
    </footer>
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
  color: #2c3e50;
}
</style>
