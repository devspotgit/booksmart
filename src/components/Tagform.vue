

<script setup>

    import { ref, defineEmits } from "vue"

    import { lib } from "../lib.js"


    const errorMes = ref("")

    
    const emit = defineEmits([ "tagAdded", "closeTagForm" ])

    
    function closeFormFromWrapper(e){

        if(e.target == e.currentTarget) emit("closeTagForm")
    }

    function closeFormFromButton(){

        emit("closeTagForm")
    }

    async function addTag(e){

        e.preventDefault()

        const formData = new FormData(e.target)

        const tagname = formData.get("name").trim()

        if(!tagname) errorMes.value = "tag name required"

        else if(!/^[a-zA-Z0-9]+$/.test(tagname)) errorMes.value = "only letters and numbers allowed"
        
        else{

            try{

                const { error } = await lib.addTag(tagname) 

                if(error){

                    if(error.reason) errorMes.value = error.message

                    else throw new Error(error.message)
                }
                else{

                    emit("tagAdded")
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
        <form class="user-form" @submit="addTag">
            <button type="button" @click="closeFormFromButton"><i class="fa-solid fa-x"></i></button>
            <span>{{ errorMes }}</span>
            <div class="user-form-detail">
                <span>Add a new tag</span>
                <input type="text" placeholder="Tag name" name="name">
                <button>Add Tag</button>
            </div>
        </form>
    </div>

</template>

