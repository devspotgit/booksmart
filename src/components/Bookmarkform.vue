


<script setup>

    import { ref, defineEmits } from "vue"

    import { lib } from "../lib.js"


    const errorMes = ref("")

    const emit = defineEmits([ "bookmarkAdded", "closeBookmarkForm" ])

    
    function closeFormFromWrapper(e){

        if(e.target == e.currentTarget) emit("closeBookmarkForm")
    }

    function closeFormFromButton(){

        emit("closeBookmarkForm")
    }

    async function addBookmark(e){

        e.preventDefault()

        const formData = new FormData(e.target)

        const url = formData.get("url")

        if(!url) errorMes.value = "url required"
        
        else{

            try{

                const { error } = await lib.addBookmark(url) 

                if(error){

                    if(error.reason) errorMes.value = error.message

                    else throw new Error(error.message)
                }
                else{

                    emit("bookmarkAdded")
                }
            }
            catch(error){

                console.log(error)
            }
        }
    }

</script>


<template>

    <div class="user-form-wrapper" @click="closeFormFromWrapper">
        <form class="user-form" @submit="addBookmark">
            <button type="button" @click="closeFormFromButton"><i class="fa-solid fa-x"></i></button>
            <span>{{ errorMes }}</span>
            <div class="user-form-detail">
                <span>Add a new bookmark</span>
                <input type="text" placeholder="Bookmark url" name="url">
                <button>Add Bookmark</button>
            </div>
        </form>
    </div>

</template>

