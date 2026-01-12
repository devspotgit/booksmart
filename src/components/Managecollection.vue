

<script setup>

    import { ref, defineEmits } from "vue"

    import { lib } from "../lib.js"

    const emit = defineEmits([  "closeManageCollection", "updatedBookmark" ])

    const props = defineProps({

        bookmark: Object,

        collections: Array
    })

    const bookmarkCollection = ref(props.bookmark.collection)

    const searchKey = ref("")

    const searchResult = ref(props.collections)

    function closeFormFromButton(){

        emit("closeManageCollection")
    }

    function closeFormFromWrapper(e){

        if(e.target == e.currentTarget) emit("closeManageCollection")
    }

    function search(){

        const key = searchKey.value.trim()

        if(!key) searchResult.value = props.collections

        else searchResult.value = props.collections.filter(collection => collection.includes(key))
    }

    async function addCollection(collection){

        try{

            const { error } = await lib.addBookmarkToCollection(collection, props.bookmark.url)

            if(error){

                throw new Error(error.message)
            }
            else{
            
                bookmarkCollection.value = collection

                emit("updatedBookmark")
            }
        }
        catch(error){

            console.log(error)
        }
    }

    async function removeCollection(){

        try{

            const { error } = await lib.removeBookmarkFromCollection(props.bookmark.url)

            if(error){

                throw new Error(error.message)
            }
            else{

                bookmarkCollection.value = null
             
                emit("updatedBookmark")
            }
        }
        catch(error){

            console.log(error)
        }
    }


</script>



<template>

    <div class="manage-wrapper" @click="closeFormFromWrapper">
        
        <div class="manage">

            <div class="manage-header">
                <button @click="closeFormFromButton"><i class="fa-solid fa-x"></i></button>
                <div class="manage-search">
                    <span><i class="fa-solid fa-magnifying-glass"></i></span>
                    <input type="text" placeholder="Search collection" v-model="searchKey" @input="search">
                </div>
            </div>

            <div class="manage-body">
                <div v-for="collection in searchResult" class="manage-item">
                    <span>{{collection}}</span>
                    <button v-if="bookmarkCollection == collection" @click="removeCollection()">-</button>
                    <button v-else @click="addCollection(collection)">+</button>
                </div>
            </div>

        </div>    
    </div>



</template>