<template>
  <form @submit.prevent="addUser">
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
        Name
      </label>
      <input
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="name"
        type="text"
        placeholder="Name"
        v-model="name"
      >
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
        Email
      </label>
      <input
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="email"
        type="email"
        placeholder="Email"
        v-model="email"
      >
    </div>
    <div class="flex items-center justify-between">
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="submit"
      >
        Add User
      </button>
    </div>
  </form>
</template>

<script>
import campusdb from "@/services/campusdb";
export default {
  data() {
    return {
      name: "",
      email: "",
    };
  },
  methods: {
    async addUser() {
      try {
        await campusdb.post("/users", {
          name: this.name,
          email: this.email,
        });
        this.$router.push({ name: "UsersList" });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>