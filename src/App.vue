


<script setup>

  import { ref, onMounted } from "vue"

  let collections = ref([])

  let tags = ref([])

  let favoriteBookmarks = ref([])

  let currentBookmarks = ref([])

  let currentBookmarkType = ref(null)

  let userInfo = ref(null)

  onMounted(() => {


  })

</script>

<template>

  <ul v-for="tag in tags">
    <li>{{tag}}</li>
  </ul>

</template>

<style scoped>

</style>
