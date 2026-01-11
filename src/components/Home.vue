

<script setup>


    import { lib } from "../lib.js"

    import { ref, onMounted } from "vue"

    import Bookmark from "./Bookmark.vue"

    import Tagform from "./Tagform.vue"

    import Collectionform from "./Collectionform.vue"

    import Bookmarkform from "./Bookmarkform.vue"

    
    const props = defineProps({

        user: Object
    })


    const isTagFormOpen = ref(false)

    const searchKey = ref("")

    const isCollectionFormOpen = ref(false)
    
    const isBookmarkFormOpen = ref(false)

    const searchPlaceholder = ref("")

    const isSideOpen = ref(false)

    const allBookmarks = ref([])

    const favoriteBookmarks = ref([])

    const allCollections = ref([])

    const allTags = ref([])

    const searchResult = ref([])

    const currentSelection = ref({})

    const currentBookmarkList = ref([])

    const currentBookmarkListTitle = ref("")


    function capitalize(name){

        return name.split("").map((letter, index) => index == 0 ? letter.toUpperCase() : letter).join("")
    }

    function searchInput(){

        const key = searchKey.value.trim()

        if(!key) searchResult.value = currentBookmarkList.value

        else{

            searchResult.value = currentBookmarkList.value.filter(item => item.title.includes(key) || item.domain.includes(key) || item.url.includes(key))
        }
    }

    function updatedBookmark(){

        favoriteBookmarks.value = lib.getFavoriteBookmarks().data

        allBookmarks.value = lib.getAllBookmarks().data

        if(currentSelection.value.type == "bookmarks"){

            currentBookmarkList.value = allBookmarks.value  

            const key = searchKey.value.trim()
            
            if(!key) searchResult.value = currentBookmarkList.value

            else searchResult.value = currentBookmarkList.value.filter(item => item.title.includes(key) || item.domain.includes(key) || item.url.includes(key))
        }
        else if(currentSelection.value.type == "favorites"){

            currentBookmarkList.value = favoriteBookmarks.value  

            const key = searchKey.value.trim()
            
            if(!key) searchResult.value = currentBookmarkList.value

            else searchResult.value = currentBookmarkList.value.filter(item => item.title.includes(key) || item.domain.includes(key) || item.url.includes(key))
        }
        else if(currentSelection.value.type == "collection"){

            currentBookmarkList.value = lib.getBookmarksFromCollection(item).data
            
            const key = searchKey.value.trim()
            
            if(!key) searchResult.value = currentBookmarkList.value

            else searchResult.value = currentBookmarkList.value.filter(item => item.title.includes(key) || item.domain.includes(key) || item.url.includes(key))
        }
        else if(currentSelection.value.type == "tag"){

            currentBookmarkList.value = lib.getBookmarksFromTag(item).data

            const key = searchKey.value.trim()
            
            if(!key) searchResult.value = currentBookmarkList.value

            else searchResult.value = currentBookmarkList.value.filter(item => item.title.includes(key) || item.domain.includes(key) || item.url.includes(key))
        }
    }

    function tagAdded(){

        isTagFormOpen.value = false

        allTags.value = lib.getAllTags().data
    }

    function collectionAdded(){

        isCollectionFormOpen.value = false

        allCollections.value = lib.getAllCollections().data
    }

    function bookmarkAdded(){

        isBookmarkFormOpen.value = false

        allBookmarks.value = lib.getAllBookmarks().data

        if(currentSelection.value.type == "bookmarks"){

            currentBookmarkList.value = allBookmarks.value  

            const key = searchKey.value.trim()
            
            if(!key) searchResult.value = currentBookmarkList.value

            else searchResult.value = currentBookmarkList.value.filter(item => item.title.includes(key) || item.domain.includes(key) || item.url.includes(key))
        }
    }

    async function removeCollection(name){

        try{

            const { error } = await lib.removeCollection(name)

            if(error) throw new Error(error.message)

            allCollections.value = lib.getAllCollections().data

            if(currentSelection.value.type == "collection" && currentSelection.value.item == name){

                currentSelection.value = {
                
                    type: "bookmarks",

                    item: null
                }

                currentBookmarkList.value = allBookmarks.value

                currentBookmarkListTitle.value = "Bookmarks"

                const key = searchKey.value.trim()

                if(!key) searchResult.value = currentBookmarkList.value

                else searchResult.value = currentBookmarkList.value.filter(item => item.title.includes(key) || item.domain.includes(key) || item.url.includes(key))
            }
        }
        catch(error){

            console.log(error)
        }
    }

    async function removeTag(name){

         try{

            const { error } = await lib.removeTag(name)

            if(error) throw new Error(error.message)

            allTags.value = lib.getAllTags().data

            if(currentSelection.value.type == "tag" && currentSelection.value.item == name){

                currentSelection.value = {
                
                    type: "bookmarks",

                    item: null
                }

                currentBookmarkList.value = allBookmarks.value

                currentBookmarkListTitle.value = "Bookmarks" 

                const key = searchKey.value
            
                if(!key) searchResult.value = currentBookmarkList.value

                else searchResult.value = currentBookmarkList.value.filter(item => item.title.includes(key) || item.domain.includes(key) || item.url.includes(key))
            }
        }
        catch(error){

            console.log(error)
        }
    }

    function changeSelection(type, item){

        currentSelection.value = {

            type: type,

            item: item
        }

        searchPlaceholder.value = "Seach in " + (item == null ? "" : item + " ")  + type

        if(type == "collection"){

            currentBookmarkList.value = lib.getBookmarksFromCollection(item).data
            
            const key = searchKey.value.trim()
            
            if(!key) searchResult.value = currentBookmarkList.value

            else searchResult.value = currentBookmarkList.value.filter(item => item.title.includes(key) || item.domain.includes(key) || item.url.includes(key))

            currentBookmarkListTitle.value = item + " Collection"  
        }
        else if(type == "tag"){

            currentBookmarkList.value = lib.getBookmarksFromTag(item).data

            const key = searchKey.value.trim()
            
            if(!key) searchResult.value = currentBookmarkList.value

            else searchResult.value = currentBookmarkList.value.filter(item => item.title.includes(key) || item.domain.includes(key) || item.url.includes(key))

            currentBookmarkListTitle.value = item + " Tag" 
        }
        else if(type == "bookmarks"){

            currentBookmarkList.value = allBookmarks.value

            const key = searchKey.value.trim()
            
            if(!key) searchResult.value = currentBookmarkList.value

            else searchResult.value = currentBookmarkList.value.filter(item => item.title.includes(key) || item.domain.includes(key) || item.url.includes(key))

            currentBookmarkListTitle.value = "Bookmarks" 
        }
        else if(type == "favorites"){

            currentBookmarkList.value = favoriteBookmarks.value

            const key = searchKey.value.trim()

            if(!key) searchResult.value = currentBookmarkList.value

            else searchResult.value = currentBookmarkList.value.filter(item => item.title.includes(key) || item.domain.includes(key) || item.url.includes(key))

            currentBookmarkListTitle.value = "Favorites" 
        }
    }


    onMounted(async () => {

        try{

            const { error } = await lib.init(props.user.id)

            if(error) throw new Error(error.message)

            allBookmarks.value = lib.getAllBookmarks().data

            allCollections.value = lib.getAllCollections().data

            allTags.value = lib.getAllTags().data

            favoriteBookmarks.value = lib.getFavoriteBookmarks().data

            currentBookmarkList.value = allBookmarks.value

            searchResult.value = currentBookmarkList.value

            currentBookmarkListTitle.value = "Bookmarks"

            searchPlaceholder.value = "Search in bookmarks..." 

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

    <Tagform  v-if="isTagFormOpen"  @tag-added="tagAdded" @close-tag-form="() => isTagFormOpen = false" />

    <Collectionform  v-if="isCollectionFormOpen"  @collection-added="collectionAdded" @close-collection-form="() => isCollectionFormOpen = false" />

    <Bookmarkform  v-if="isBookmarkFormOpen"  @bookmark-added="bookmarkAdded" @close-bookmark-form="() => isBookmarkFormOpen = false" />


    <div class="home" :class="{ 'side-open': isSideOpen }">

        <!-- side panel -->

        <div class="side">
            <div class="side-header">
                <div class="user-info">
                    <span>{{ capitalize(user.email.split("@")[0]) }}</span>
                    <button @click="isSideOpen = false"><i class="fa-solid fa-x"></i></button>
                </div>
                <button>Logout</button>
            </div>
            <div class="side-body">
                <button @click="isBookmarkFormOpen = true">Add Bookmark</button>
                <div class="quick-access">
                    <div class="quick-access-item" :class="{ 'current-selection': currentSelection.type == 'bookmarks' }">
                        <button @click="changeSelection('bookmarks', null)">Bookmarks</button>
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
                        <button @click="isCollectionFormOpen = true">+</button>
                    </div>
                    <div class="collection-list">
                        <div class="collection-item" v-for="item in allCollections" :class="{ 'current-selection': currentSelection.type == 'collection' && currentSelection.item == item }">
                            <button @click="changeSelection('collection', item)">{{ item }}</button>
                            <span>{{  lib.getBookmarksFromCollection(item).data.length }}</span>
                            <button @click="removeCollection(item)">-</button>
                        </div>
                    </div>
                </div>
                <div class="tags">
                    <div class="tag-header">
                        <span>Tags</span>
                        <button @click="isTagFormOpen = true">+</button>
                    </div>
                    <div class="tag-list">
                        <div class="tag-item" v-for="item in allTags" :class="{ 'current-selection': currentSelection.type == 'tag' && currentSelection.item == item }">
                            <button @click="changeSelection('tag', item)">{{ item }}</button>
                            <span>{{  lib.getBookmarksFromTag(item).data.length }}</span>
                            <button @click="removeTag(item)">-</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        
        <!-- main  -->

        <div class="main">
            <div class="main-header">
                <div class="brand">
                    <a href="/">Booksmart</a>
                    <button @click="isSideOpen = true"><i class="fa-solid fa-bars"></i></button>
                </div>
                <div class="search">
                    <span><i class="fa-solid fa-magnifying-glass"></i></span>
                    <input type="text" :placeholder="searchPlaceholder" v-model="searchKey" @input="searchInput">
                </div>
            </div>
            <div class="main-body">
                <span>{{ currentBookmarkListTitle }}</span>
                <div class="bookmark-list">
                    <Bookmark  v-for="item in searchResult" :bookmark="item"  @updated-bookmark="updatedBookmark" />
                </div>
            </div>
            <div class="main-overlay" :class="{ 'main-overlay-show': isSideOpen }" @click="isSideOpen = false"></div>
        </div>

    </div>

</template>



<style scoped></style>

