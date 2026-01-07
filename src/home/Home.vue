

<script setup>

    import { lib } from "../lib.js"

    import { ref, onMounted } from "vue"

    import { supabase } from "../supabaseConfig.js"

    const props = defineProps({

        user: Object
    })

    onMounted(async () => {

    //    try{

    //     await lib.init(props.user.id)

    //     const res = await lib.removeCollection("css")

    //     console.log(lib.getAllBookmarks())
    //     console.log(lib.getAllCollections())
    //     console.log(lib.getAllTags())
    //     console.log(res)
    //    }
    //    catch(error){

    //     console.log(error)
    //    }

       
    })

</script>



<template>

    <div class="Home">{{ user.email }}</div>

</template>



<style scoped></style>

