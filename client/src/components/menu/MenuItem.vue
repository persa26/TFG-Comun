<template>
  <div class="rounded-md shadow m-2">
    <router-link :to="item.to"
        class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
        {{ item.text }}
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