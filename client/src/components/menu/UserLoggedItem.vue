<template>
  <div class="flex items-center justify-start mr-20 pb-6">
    <div class="relative">
      <p v-if="user.photo">
        <img
          v-bind:src="user.photo"
          alt="avatar"
          class="rounded-full h-12 w-12 mr-2"
        />
      </p>
      <p v-if="!user.photo">
        <img
          src="https://i.pravatar.cc/100"
          alt="avatar"
          class="rounded-full h-12 w-12 mr-2"
          style="max-width: 50px; max-height: 50px; width: auto; height: auto;"
        />
      </p>
    </div>
    <div class="ml-3">
      <div class="text-sm">
        <p class="text-gray-600 dark:text-gray-400">{{ user.mail }}</p>
        <div class="-mt-1" style="margin-top: 1.5px">
          <button
            @click="logout"
            class="text-sm font-medium leading-5 text-red-500 hover:text-red-700 transition duration-150 ease-in-out"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import campusdb from "@/services/campusdb";
export default {
  data() {
    return {
      // Get user from store
      user: campusdb.getUser(campusdb.getUserLogged()).then((res) => {
        this.user = res.data[0];
      }),
    };
  },
  methods: {
    logout() {
      campusdb.logout();
      window.location.reload();
    },
  },
};
</script>

<style></style>
