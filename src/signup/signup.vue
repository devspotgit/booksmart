

<script setup>

    import { ref } from "vue"

    import { supabase } from "../supabaseConfig"

    import { router } from "../router.js"
    
    const errorMessage = ref("")

    async function submit(e){

        e.preventDefault()

        const formData = new FormData(e.target)

        const { error } = await supabase.auth.signUp({

            email: formData.get("email"),
            
            password: formData.get("password"),
        })

        if(error){

           errorMessage.value = error.message
        }
        else{

            router["/"]()
        }
    }

</script>



<template>

    <form @submit="submit" class="sign-form">
        <span>{{ errorMessage }}</span>
        <span>SIGN UP</span>
        <input type="text" placeholder="Email" name="email">
        <input type="password" placeholder="Password" name="password">
        <button>SIGN UP</button>
        <span>Already have an account, <a href="/signin">Sign in</a></span>
    </form>

</template>



<style scoped>

    
</style>

