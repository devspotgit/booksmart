

<script setup>

    import { lib } from "../lib.js"

    import { ref, onMounted } from "vue"

    const props = defineProps({

        user: Object
    })

    onMounted(async () => {

        // try{
    
        //     const tag = await lib.addTag("movies")
    
        //     console.log(tag)
        // }
        // catch(error){
    
        //     console.log(error)
        // }
    })

</script>



<template>

    <div class="Home">{{ user.email }}</div>

</template>



<style scoped></style>

