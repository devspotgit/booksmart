
import { createClient } from "@supabase/supabase-js"


const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_ANON_KEY)


const booksmart = {

    collections: [],

    tags: [],

    bookmarks: [],


    init(){


    },


    reset(){


    },


    authListen(signedIn, signedOut){

        supabase.auth.onAuthStateChange((event, session) => {

            if(session){

                this.init()

                signedIn({})
            }
            else{

                this.reset()

                signedOut({})
            }
        })
    },

   






}

export default booksmart





/*
    -- Tables

        -> Collections
            - id (unique, auto)
            - name (unique, required)

        -> Tags
            - id (unique, auto)
            - name (unique, required)

        -> Bookmarks
            - id (unique, auto)
            - image (required)
            - createdAt (required)
            - isFavorite (default:false)
            - collection (default:null)
            - tags default:null)
            - url (unique, required)
            - title (required)
            - domain (required)


    -- High Level Api

        - login(email, password)
        - signup(email, password)
        - logout()
        - addTag(name)
        - removeTag(id)
        - addCollection(name)
        - removeCollection(id)
        - addBookmarkToCollection(bookmarkId, collectionName)
        - removeBookmarkFromCollection(bookmarId)
        - addBookmarkToTag(bookmarkId, tagName)
        - removeBookmarkToTag(bookmarkId, tagName)
        - addBookmark(url)
        - removeBookmark(id)

*/



