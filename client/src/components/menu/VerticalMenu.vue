<template>
  <div>
    <UserItem v-if="isAutenticate" />
    <ul class="mt-4">
      <menu-item v-for="item in items" :key="item.text" :item="item"></menu-item>
    </ul>
  </div>
</template>

<style>
.menu-item-text {
  white-space: pre-line;
}
</style>


<script>
import MenuItem from './MenuItem.vue';
import UserItem from "./UserLoggedItem.vue";
import campusdb from "@/services/campusdb";

export default {
  name: "VerticalMenu",
  components: { MenuItem, UserItem },
  data() {
    return {
      items: [
        { text: 'Home', to: '/' },
        { text: 'Users', to: '/users' },
        { text: 'Estudiantes', to: '/students' },
        { text: 'Grupos', to: '/groups' },
        { text: 'Ubicaciones', to: '/locations' },
        { text: 'Asignación de grupos a localizaciones', to: '/grouplocations' },
        { text: 'Asignación de estudiantes a grupos', to: '/studentsgroup' },
        { text: 'Identificación', to: '/identification' },
      ],
      isAutenticate: campusdb.getUserLogged() !== undefined,
    }
  }
}
</script>
