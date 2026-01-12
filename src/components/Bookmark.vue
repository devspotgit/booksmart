

<script setup>

    import { ref, defineEmits } from "vue"

    import { lib } from "../lib.js"

    const isMenuOpen = ref(false)

    const emit = defineEmits(["manageTag", "manageCollection", "updatedBookmark" ])

    const props = defineProps({

        bookmark: Object
    })

    function manageCollection(){

        isMenuOpen.value = false

        emit("manageCollection", props.bookmark)
    }

    function manageTag(){

        isMenuOpen.value = false

        emit("manageTag", props.bookmark)
    }

    async function addToFavorite(){

        try{

            const { error } = await lib.setBookmarkAsFavorite(props.bookmark.url)

            if(error) throw new Error(error.message)

            isMenuOpen.value = false

            emit("updatedBookmark")
        }
        catch(error){

            console.log(error)
        }
    }

    async function removeFromFavorite(){

        try{

            const { error } = await lib.unsetBookmarkAsFavorite(props.bookmark.url)

            if(error) throw new Error(error.message)

            isMenuOpen.value = false

            emit("updatedBookmark")
        }
        catch(error){

            console.log(error)
        }
    }

    async function removeBookmark(){

        try{

            const { error } = await lib.removeBookmark(props.bookmark.url)

            if(error) throw new Error(error.message)

             isMenuOpen.value = false

            emit("updatedBookmark")
        }
        catch(error){

            console.log(error)
        }
    }


</script>


<template>

    <div class="bookmark-item">
        <div class="bookmark-item-menu">
            <div class="bookmark-item-image">
                <img :src="bookmark.image">
            </div>
            <button @click="isMenuOpen = !isMenuOpen"><i class="fa-solid fa-ellipsis-vertical"></i></button>
            <div class="bookmark-item-settings" :class="{'menu-open': isMenuOpen}">
                <button @click="manageTag">Manage Tags</button>
                <button @click="manageCollection">Manage Collection</button>
                <button @click="addToFavorite" v-if="!bookmark.favorite">Add To Favorite</button>
                <button @click="removeFromFavorite" v-if="bookmark.favorite">Remove From Favorite</button>
                <button @click="removeBookmark">Remove Bookmark</button>
            </div>
        </div>
        <div class="bookmark-item-info">
            <span>{{ bookmark.title }}</span>
            <span>{{ bookmark.domain }}</span>
            <a :href="bookmark.url" target="_blank">Visit Link</a>
        </div>
    </div>

</template>


