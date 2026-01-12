

<script setup>

    import { ref } from "vue"

    import { lib } from "../lib.js"

    const errorMessage = ref("")

    async function submit(e){

        e.preventDefault()

        const formData = new FormData(e.target)

        const email = formData.get("email")

        const password = formData.get("password")

        const {error} = await lib.signin( email, password)

        if(error) errorMessage.value = error.message
    }

</script>



<template>

    <div class="sign-form-wrapper">

        <form @submit="submit" class="sign-form">
            <span class="sign-form-error">{{ errorMessage }}</span>
            <span class="sign-form-title">SIGN IN</span>
            <input class="sign-form-field" type="text" placeholder="Email" name="email">
            <input class="sign-form-field" type="password" placeholder="Password" name="password">
            <button class="sign-form-submit">SIGN IN</button>
            <span class="sign-form-action">Don't have an account yet, <a href="/signup">Sign up</a></span>
        </form>

    </div>

</template>



<style scoped></style>