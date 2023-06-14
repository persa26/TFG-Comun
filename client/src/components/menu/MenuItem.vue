<template>
  <div class="rounded-md shadow m-2">
    <router-link
      :to="item.to"
      class="relative w-full flex items-center justify-center px-8 py-3 border border-blue-600 text-base font-medium rounded-md text-blue-600 hover:text-white hover:bg-blue-600 hover:border-blue-700 md:py-4 md:text-lg md:px-10 transition-colors duration-300 ease-in-out router-link-active:not(:hover) .text-blue-600 {color: white;}"
    >
      <span class="relative z-10">{{ item.text }}</span>
      <span
        class="absolute inset-0 bg-blue-300 opacity-75 rounded-md"
        v-show="$route.path === item.to"
      ></span>
    </router-link>
  </div>
</template>


<script>
export default {
  props: {
    item: Object
  }
}
</script>
