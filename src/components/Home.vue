

<script setup>


    import { lib } from "../lib.js"

    import { ref, onMounted } from "vue"

    const searchPlaceholder = ref("Search in bookmarks...")

    const isSideOpen = ref(false)

    const allBookmarks = ref([])

    const favoriteBookmarks = ref([])

    const allCollections = ref([])

    const allTags = ref([])

    const currentSelection = ref({})


    const props = defineProps({

        user: Object
    })

    function searchInput(){

    }

    function addColection(){

    }

    function removeCollection(){

    }

    function addTag(){

    }

    function removeTag(){

    }

    function changeSelection(type, item){

        currentSelection.value = {

            type: type,

            item: item
        }

        searchPlaceholder.value = "Seach in " + (item == null ? "" : item + " ")  + type
    }


    onMounted(async () => {

        try{

            await lib.init(props.user.id)

            allBookmarks.value = lib.getAllBookmarks().data

            allCollections.value = lib.getAllCollections().data

            allTags.value = lib.getAllTags().data

            favoriteBookmarks.value = lib.getFavoriteBookmarks().data

            currentSelection.value = {
                
                type: "bookmarks",

                item: null
            }
        }
        catch(error){

            console.log(error)
        }
    })

</script>



<template>

    <div class="home" :class="{ 'side-open': isSideOpen }">

        <div class="side">
            <div class="side-header">
                <div class="user-info">
                    <span>{{ user.email.split("@")[0].split("").map((letter, index) => index == 0 ? letter.toUpperCase() : letter).join("") }}</span>
                    <button @click="isSideOpen = false"><i class="fa-solid fa-x"></i></button>
                </div>
                <button>Logout</button>
            </div>
            <div class="side-body">
                <button>Add Bookmark</button>
                <div class="quick-access">
                    <div class="quick-access-item" :class="{ 'current-selection': currentSelection.type == 'bookmarks' }">
                        <button @click="changeSelection('bookmarks', null)">All Bookmarks</button>
                        <span>{{ allBookmarks.length }}</span>
                    </div>
                    <div class="quick-access-item" :class="{ 'current-selection': currentSelection.type == 'favorites' }">
                        <button @click="changeSelection('favorites', null)">Favorites</button>
                        <span>{{ favoriteBookmarks.length }}</span>
                    </div>
                </div>
                <div class="collections">
                    <div class="collection-header">
                        <span>Collections</span>
                        <button @click="addColection">+</button>
                    </div>
                    <div class="collection-list">
                        <div class="collection-item" v-for="item in allCollections" :class="{ 'current-selection': currentSelection.type == 'collection' && currentSelection.item == item }">
                            <button @click="changeSelection('collection', item)">{{ item.split("").map((letter, index) => index == 0 ? letter.toUpperCase() : letter).join("") }}</button>
                            <span>{{  lib.getBookmarksFromCollection(item).data.length }}</span>
                            <button @click="removeCollection">-</button>
                        </div>
                    </div>
                </div>
                <div class="tags">
                    <div class="tag-header">
                        <span>Tags</span>
                        <button @click="addTag">+</button>
                    </div>
                    <div class="tag-list">
                        <div class="tag-item" v-for="item in allTags" :class="{ 'current-selection': currentSelection.type == 'tag' && currentSelection.item == item }">
                            <button @click="changeSelection('tag', item)">{{ item.split("").map((letter, index) => index == 0 ? letter.toUpperCase() : letter).join("") }}</button>
                            <span>{{  lib.getBookmarksFromTag(item).data.length }}</span>
                            <button @click="removeTag">-</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        
        <div class="main">
            <div class="main-header">
                <div class="brand">
                    <a href="/">Booksmart</a>
                    <button @click="isSideOpen = true"><i class="fa-solid fa-bars"></i></button>
                </div>
                <div class="search">
                    <span><i class="fa-solid fa-magnifying-glass"></i></span>
                    <input type="text" :placeholder="searchPlaceholder" @input="searchInput">
                </div>
            </div>
            <div class="main-body"></div>
            <div class="main-overlay" :class="{ 'main-overlay-show': isSideOpen }" @click="isSideOpen = false"></div>
        </div>

    </div>

</template>



<style scoped></style>

