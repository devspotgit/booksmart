
import { supabase } from "./supabaseConfig.js"

const lib = {

    bookmarks: null,

    collections: null,

    tags: null,

    userId: null,


    init(userId){

        this.userId = userId

        return supabase.from("Bookmarks").select("url, title, domain, favorite, image, tags, collection, created_at").eq("user_id", this.userId).then(({ error, data }) => {

            if(data){

                this.bookmarks = [ ...data ]

                return null
            }
            else{

                return Promise.reject(error)
            }
        })
        .then( () => {

            return supabase.from("Collections").select("name").eq("user_id", this.userId).then(({ error, data }) => {

                if(data){

                    this.collections = [ ...data ]

                    return null
                }
                else{

                    return Promise.reject(error)
                }
            })
        })
        .then( () => {

            return supabase.from("Tags").select("name").eq("user_id", this.userId).then(({ error, data }) => {

                if(data){

                    this.tags = [ ...data ]

                    return null
                }
                else{

                    return Promise.reject(error)
                }
            })
        })
    },

    signout(){

        return supabase.auth.signOut().then(({error}) => {

            if(error) return Promise.reject(error)

            else return null
        })
    },

    signin(email, password){

        return supabase.auth.signInWithPassword({

            email: email,
            
            password: password
        })
        .then(({error, data}) => {

            if(error)  return Promise.reject(error)
            
            else return data
        })
    },

    signup(email, password){

        return supabase.auth.signUp({

            email: email,

            password: password
        })
        .then(({error, data}) => {

            if(error) return Promise.reject(error)

            else return data
        })
    },

    addBookmark(url){

        const bookmark = this.bookmarks.find(bookmark => bookmark.url == url)

        if(!bookmark){

            // ...
        }
        else{

            return "bookmark already added"
        }
    },

    addCollection(name){

        const collection = this.collections.find(collection => collection == name)

        if(!collection){

            return supabase.from("Collections").insert({ name: name }).then(({error}) => {
    
                if(error) return Promise.reject(error)
        
                else {

                    this.collections.push(name)

                    return null
                }
            })
        }
        else{

            return "collection already added"
        }
    },

    addTag(name){

        const tag = this.tags.find(tag => tag == name)

        if(!tag){

            return supabase.from("Tags").insert({ name: name }).then(({error}) => {
    
                if(error) return Promise.reject(error)
        
                else {

                    this.collections.push(name)

                    return null
                }
            })
        }
        else{

            return "tag already added"
        }
    },

    removeBookmark(url){

        return supabase.from("Bookmarks").delete().eq("url", url).eq("user_id", this.userId).then(() => {

            this.bookmarks = this.bookmarks.filter(bookmark => bookmark.url != url)

            return null
        })
    },

    removeCollection(name){

        return supabase.from("Collections").delete().eq("name", name).eq("user_id", this.userId).then(() => {

            this.collections = this.collections.filter(collection => collection != name)

            return null
        })
    },

    removeTag(name){

        return supabase.from("Tags").delete().eq("name", name).eq("user_id", this.userId).then(() => {

            this.tags = this.tags.filter(tag => tag != name)

            return null
        })
    },

    getBookmarksFromCollection(name){

        return this.bookmarks.filter(bookmark => bookmark.collection == name)
    },

    getBookmarksFromTag(name){

        return this.bookmarks.filter(bookmark => bookmark.collection == name)
    },

    getAllBookmarks(){

        return [ ...this.bookmarks ]
    },

    getAllTags(){

        return [ ...this.tags ]
    },

    getAllCollections(){

        return [ ...this.collections ]
    },

    addBookmarkToCollection(){

    },

    addBookmarkToTag(){

    },

    setBookmarkAsFavourite(name){

    },

    getFavoriteBookmarks(){

        return this.bookmarks.filter(bookmark => bookmark.favorite == true)
    },

    removeBookmarkFromTag(){

    },

    removeBookmarkFromCollection(){

    }

}

export { lib }

