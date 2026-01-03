

<script setup>

    import { ref } from "vue"

    import { supabase } from "../supabaseConfig"

    const errorMessage = ref("")

    function submit(e){

        e.preventDefault()

        const formData = new FormData(e.target)
    }


</script>



<template>

    <form @submit="submit" class="sign-form">
        <span>{{ errorMessage }}</span>
        <span>SIGN IN</span>
        <input type="text" placeholder="Email">
        <input type="password" placeholder="Password">
        <button>SIGN IN</button>
        <span>Don't have an account yet, <a href="/signup">Sign up</a></span>
    </form>

</template>



<style scoped>

    
</style>