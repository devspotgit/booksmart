
import { supabase } from "./supabaseConfig.js"

const lib = {

    bookmarks: null,

    collections: null,

    tags: null,

    userId: null,


    init(userId){

        this.userId = userId

        // get all the bookmarks from the db
        return supabase.from("Bookmarks").select().eq("user_id", this.userId).then(({ error, data }) => {

            if(data){

                const bookmarks = data

                this.bookmarks = bookmarks.map(({url, title, domain, favorite, image, tags, collection, created_at}) => {

                    url, title, domain, favorite, image, tags, collection, created_at
                })

                return null
            }
            else{

                return Promise.reject(error)
            }
        })
        .then( () => {

            // get all the collections from the db
            return supabase.from("Collections").select().eq("user_id", this.userId).then(({ error, data }) => {

                if(data){

                    const collections = data

                    this.collections = collections.map(({name}) => name)

                    return null
                }
                else{

                    return Promise.reject(error)
                }
            })
        })
        .then( () => {

            // get all tags from the db
            return supabase.from("Tags").select().eq("user_id", this.userId).then(({ error, data }) => {

                if(data){

                    const tags = data

                    this.tags = tags.map(({name}) => name)

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

    // addBookmark(url){

    //     const bookmark = this.bookmarks.find(bookmark => bookmark.url == url)

    //     if(!bookmark){


            
    //     }
    //     else{

    //         return "bookmark already added"
    //     }
    // },

    addCollection(name){

        // get the collection with the specified name if exists
        const collection = this.collections.find(collection => collection == name)

        if(!collection){

            // add collection to the db
            return supabase.from("Collections").insert({ name: name }).then(({error}) => {
    
                if(error) return Promise.reject(error)
        
                else {

                    // add collection to the list
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

        // get the tag with the specified name if exists
        const tag = this.tags.find(tag => tag == name)

        if(!tag){

            // add tag to the db
            return supabase.from("Tags").insert({ name: name }).then(({error}) => {
    
                if(error) return Promise.reject(error)
        
                else {

                    // add tag to the list
                    this.tags.push(name)

                    return null
                }
            })
        }
        else{

            return "tag already added"
        }
    },

    removeBookmark(url){

        // remove bookmark from the db
        return supabase.from("Bookmarks").delete().eq("url", url).eq("user_id", this.userId).then(() => {

            // remove bookmark from the list
            this.bookmarks = this.bookmarks.filter(bookmark => bookmark.url != url)

            return null
        })
    },

    removeCollection(name){

        // removing the collection from the db
        return supabase.from("Collections").delete().eq("name", name).eq("user_id", this.userId).then(() => {

            // update bookmarks that has that collection from the db
            return supabase.from("Bookmarks").update({ collection: null }).eq("user_id", this.userId).eq("collection", name).then(({error}) => {

                if(!error){
                
                    // removing collection from the list
                    this.collections = this.collections.filter(collection => collection != name)

                    // removing collection for any bookmark that has it
                    this.bookmarks.forEach(bookmark => {

                        if(bookmark.collection == name) bookmark.collection = null
                    })

                    return null
                }
            })
        })
    },

    removeTag(name){

        // removing the tag from the db
        return supabase.from("Tags").delete().eq("name", name).eq("user_id", this.userId).then(() => {

            // array of promises
            const pr = this.bookmarks.map(bookmark => new Promise((resolve, _) => {

                // loop through all bookmarks and return a promise

                // get the specified tag if exists
                const tag = bookmark.tags.split("-").find(tag => tag == name)

                if(tag){

                    // compute the new tags
                    const tags = bookmark.tags.split("-").filter(tag => tag != name).join("-")
                
                    // update tags from the db
                    resolve(supabase.from("Bookmarks").update({ tags: tags }).eq("user_id", this.userId).eq("url", bookmark.url).then(({error}) => {
                    
                        if(!error){

                            // update tags from the list
                            bookmark.tags = tags
                        
                            return null
                        }
                    }))
                }
                else{
                
                    resolve(null)
                }
            }))

            return Promise.all(pr).then(() => {
            
                // update the list
                this.tags = this.tags.filter(tag => tag != name)

                return null
            })
        })
    },

    getBookmarksFromCollection(name){

        return this.bookmarks.filter(bookmark => bookmark.collection == name)
    },

    getBookmarksFromTag(name){

        return this.bookmarks.filter(bookmark => bookmark.tags.split("-").find(tag => tag == name))
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

    addBookmarkToCollection(name, url){

        const bookmark = this.bookmarks.find(bookmark => bookmark.url == url)

        if(bookmark.collection != name){
        
            // update bookmark from the db
            return supabase.from("Bookmarks").update({collection: name}).eq("user_id", this.userId).eq("url", url).then(({error}) => {

                if(!error){

                   bookmark.collection = name

                    return null
                }
            })
        }
        else{
        
            return "bookmark already added to collection " + name
        }
    },

    addBookmarkToTag(name, url){

        const bookmark = this.bookmarks.find(bookmark => bookmark.url == url)

        const tag = bookmark.tags.split("-").find(tag => tag == name)

        if(!tag){

            const tags = [ ...bookmark.tags.split("-"), tag ].join("-")
        
            // update bookmark from the db
            return supabase.from("Bookmarks").update({ tags: tags }).eq("user_id", this.userId).eq("url", url).then(({error}) => {
            
                if(!error){
                
                    bookmark.tags = tags

                    return null
                }
            })
        }
        else{

            return "bookmark already added to tag " + name
        }

    },

    setBookmarkAsFavorite(url){

        return supabase.from("Bookmarks").update({favorite: true}).eq("user_id", this.userId).eq("url", url).then(({error}) => {

            const bookmark = this.bookmarks.find(bookmark => bookmark.url == url)

            bookmark.favorite = true
        })
    },

    unsetBookmarkAsFavorite(url){

        return supabase.from("Bookmarks").update({favorite: false}).eq("user_id", this.userId).eq("url", url).then(({error}) => {

            const bookmark = this.bookmarks.find(bookmark => bookmark.url == url)

            bookmark.favorite = false
        })
    },

    getFavoriteBookmarks(){

        return this.bookmarks.filter(bookmark => bookmark.favorite == true)
    },

    removeBookmarkFromTag(name, url){

        const bookmark = this.bookmarks.find(bookmark => bookmark.url == url )

        const tags = bookmark.tags.split("-").filter(tag => tag != name).join("-")

        // update bookmark from the db
        return supabase.from("Bookmarks").update({tags: tags}).eq("user_id", this.userId).eq("url", url).then(({error}) => {

            if(!error){

                // update bookmark from the list
                bookmark.tags = tags
            }
        })

    },

    removeBookmarkFromCollection(url){

        const bookmark = this.bookmarks.find(bookmark => bookmark.url == url)

        // update bookmark from the db
        return supabase.from("Bookmarks").update({collection: null}).eq("user_id", this.userId).eq("url", url).then(({error}) => {

            if(!error){

                // update bookmark from the list
                bookmark.collection = null
            }
        })
    }

}

export { lib }

