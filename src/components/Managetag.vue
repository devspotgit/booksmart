

<script setup>

    import { ref, defineEmits} from "vue"

    import { lib } from "../lib.js"

    const props = defineProps({

        bookmark: Object,

        tags: Array
    })

    const emit = defineEmits([ "closeManageTag", "updatedBookmark"])

    const bookmarkTags = ref(props.bookmark.tags == null ? [ ] : props.bookmark.tags.split("-"))

    const searchKey = ref("")

    const searchResult = ref(props.tags)

    function closeFormFromButton(){

        emit("closeManageTag")
    }

    function closeFormFromWrapper(e){

        if(e.target == e.currentTarget) emit("closeManageTag")
    }

    function search(){

        const key = searchKey.value.trim()

        if(!key) searchResult.value = props.tags

        else searchResult.value = props.tags.filter(tag => tag.includes(key))
    }

    function hasTag(tag){

        if(bookmarkTags.value.length == 0) return false

        const t = bookmarkTags.value.find(item => item == tag )

        if(t) return true

        return false
    }

    async function addTag(tag){

        try{

            const { error } = await lib.addBookmarkToTag(tag, props.bookmark.url)

            if(error){

                throw new Error(error.message)
            }
            else{

                bookmarkTags.value.push(tag)
             
                emit("updatedBookmark")
            }
        }
        catch(error){

            console.log(error)
        }
    }

    async function removeTag(tag){

        try{

            const { error } = await lib.removeBookmarkFromTag(tag, props.bookmark.url)

            if(error){

                throw new Error(error.message)
            }
            else{

                bookmarkTags.value = bookmarkTags.value.filter(item => tag !=  item)
                
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
                    <input type="text" placeholder="Search tag" v-model="searchKey" @input="search">
                </div>
            </div>

            <div class="manage-body">
                <div v-for="tag in searchResult" class="manage-item">
                    <span>{{tag}}</span>
                    <button v-if="hasTag(tag)" @click="removeTag(tag)">-</button>
                    <button v-else @click="addTag(tag)">+</button>
                </div>
            </div>

        </div>    
    </div>

</template>