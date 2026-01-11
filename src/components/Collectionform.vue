

<script setup>

    import { ref, defineEmits } from "vue"

    import { lib } from "../lib.js"

    
    const errorMes = ref("")

    const emit = defineEmits([ "collectionAdded", "closeCollectionForm" ])

    
    function closeFormFromWrapper(e){

        if(e.target == e.currentTarget) emit("closeCollectionForm")
    }

    function closeFormFromButton(){

        emit("closeCollectionForm")
    }

    async function addCollection(e){

        e.preventDefault()

        const formData = new FormData(e.target)

        const colname = formData.get("name").trim()
        
        if(!colname) errorMes.value = "collection name required"

        else if(!/^[a-zA-Z0-9]+$/.test(colname)) errorMes.value = "only letters and numbers allowed"
        
        else{

            try{

                const { error } = await lib.addCollection(colname) 

                if(error){

                    if(error.reason) errorMes.value = error.message

                    else throw new Error(error.message)
                }
                else{

                    emit("collectionAdded")
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
        <form class="user-form" @submit="addCollection">
            <button type="button" @click="closeFormFromButton"><i class="fa-solid fa-x"></i></button>
            <span>{{ errorMes }}</span>
            <div class="user-form-detail">
                <span>Add a new collection</span>
                <input type="text" placeholder="Collection name" name="name">
                <button>Add Collection</button>
            </div>
        </form>
    </div>


</template>

