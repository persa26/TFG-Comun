<template>
  <div class="home">
    <div class="home__content__body">
        <!-- Welcome title in tailwind on the right of screen -->
      <div class="home__content__body__welcome">
        <h1 class="text-4xl font-bold text-gray-800">Welcome to Campus</h1>
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
