<template>
  <div class="home">
    <div class="home__content__body">
      <!-- Welcome title in tailwind on the right of screen -->
      <div class="home__content__body__welcome">
        <h1 class="text-4xl font-bold text-gray-800">Bienvenido al Sistema de Control de Accesos</h1>
      </div>
      <div>
        <p class="text-lg text-gray-600">
          Experimenta un control de acceso sin problemas y una seguridad mejorada
          con nuestro avanzado sistema Campus. Gestiona usuarios, estudiantes,
          localizaciones, grupos, registros y más con facilidad.

          Mantente en control de las operaciones de tu campus y garantiza un
          entorno seguro y productivo para todos.
        </p>
      </div>
      <!-- <PostsView /> -->
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import campusdb from "@/services/campusdb";

export default {
  name: "HomeView",
  data: () => ({
    isAutenticate: campusdb.getUserLogged() !== undefined,
  }),
  components: {
  },
};
</script>
