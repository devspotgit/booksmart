

<script setup>

    import { lib } from "../lib.js"

    import { ref, onMounted } from "vue"

    const props = defineProps({

        user: Object
    })

    onMounted(async () => {

        try{

            await lib.init(props.user.id)
    
            // const {error} = await lib.addBookmark("https://www.google.com")

            // const {error} = await lib.addTag("tv")

            // const { error } = await lib.removeCollection("fun")

            // const { error } = await lib.addCollection("mangas")

            // const { error } = await  lib.addBookmarkToCollection("react", "https://www.google.com")

            // const { error } = await  lib.addBookmarkToCollection("fun", "https://www.github.com")

            // const { error } = await  lib.addBookmarkToTag("tv", "https://www.google.com")

            // const { error } = await  lib.addBookmarkToTag("books", "https://www.github.com")

            // const { error } = await lib.removeTag("books")

            // const { data } = lib.getBookmarksFromTag("comics")

            // const { data } = lib.getBookmarksFromCollection("react")

            // const { error } = lib.unsetBookmarkAsFavorite("https://www.github.com")
            
            const book = lib.getAllBookmarks()
    
            const col = lib.getAllCollections()
    
            const tag = lib.getAllTags()
    
            console.log(book.data)
    
            console.log(col.data)
            
            console.log(tag.data)

            // console.log(error)
        }
        catch(error){

            console.log(error)
        }

    })

</script>



<template>

    <div class="Home">{{ user.email }}</div>

</template>



<style scoped></style>

