<template>
  <UserItem v-if="isAutenticate" />
  <ul>
    <menu-item v-for="item in items" :key="item.text" :item="item"></menu-item>
  </ul>
</template>

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
        { text: 'Students', to: '/students' },
        { text: 'Users', to: '/users' },
      ],
      isAutenticate: campusdb.getUserLogged() !== undefined,
    }
  }
}
</script>