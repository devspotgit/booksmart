

<script setup>

    import { ref } from "vue"

    import { supabase } from "../supabaseConfig.js"
    
    const errorMessage = ref("")

    async function submit(e){

        e.preventDefault()

        const formData = new FormData(e.target)

        try{

            const { error } = await supabase.auth.signUp({
    
                email: formData.get("email"),
                
                password: formData.get("password"),
            })
    
            if(error){
    
               errorMessage.value = error.message
            }
        }
        catch(er){

            console.log(er)
        }

    }

</script>



<template>

    <form @submit="submit" class="sign-form">
        <span class="sign-form-error">{{ errorMessage }}</span>
        <span class="sign-form-title">SIGN UP</span>
        <input class="sign-form-field" type="text" placeholder="Email" name="email">
        <input class="sign-form-field" type="password" placeholder="Password" name="password">
        <button class="sign-form-submit">SIGN UP</button>
        <span class="sign-form-action">Already have an account, <a href="/signin">Sign in</a></span>
    </form>

</template>



<style scoped></style>

