
import { supabase } from "./supabaseConfig.js"

const lib = {

    bookmarks: [],

    collections: [],

    tags: [],

    userId: null,



    init(userId){

        this.userId = userId

        return supabase.from("Bookmarks").select().eq("user_id", this.userId).then(({ error, data }) => {

            if(!error){

                const bookmarks = data

                this.bookmarks = bookmarks.map(({url, title, domain, favorite, image, tags, collection, created_at}) => ({

                    url, title, domain, favorite, image, tags, collection, created_at
                }))
            }
            
            return { error }
        })
        .then( ({ error }) => {

            if(!error){

                return supabase.from("Collections").select().eq("user_id", this.userId).then(({ error, data }) => {
    
                    if(!error){
    
                        const collections = data
    
                        this.collections = collections.map(({name}) => name)
                    }

                    return { error }
                })
            }

            return { error }
        })
        .then( ({ error }) => {

            if(!error){

                return supabase.from("Tags").select().eq("user_id", this.userId).then(({ error, data }) => {
    
                    if(!error){
    
                        const tags = data
    
                        this.tags = tags.map(({name}) => name)
                    }

                    return { error }
                })
            }

            return { error }
        })
    },

    

    signout(){

        return supabase.auth.signOut().then(({error}) => ({ error }))
    },



    signin(email, password){

        return supabase.auth.signInWithPassword({

            email: email,
            
            password: password
        })
        .then(({ error }) => ({ error }))
    },



    signup(email, password){

        return supabase.auth.signUp({

            email: email,

            password: password
        })
        .then(({ error }) => ({ error }))
    },



    addBookmark(url){

        const bookmark = this.bookmarks.find(bookmark => bookmark.url == url)

        if(!bookmark){

            return fetch(`https://webmetadata.vercel.app/getmeta?url=${url}`)

            .then((res) => res.json())

            .then(({error, data}) => {

                if(!error){

                    const bookmark = { 

                        title: data.title,

                        url: url,

                        domain: data.domain, 
                        
                        image: data.favicon
                    }

                    return supabase.from("Bookmarks").insert(bookmark).select().then(( {error, data } ) => {

                        const { url, title, domain, favorite, image, tags, collection, created_at } = data[0]

                        if(!error) this.bookmarks.push({ url, title, domain, favorite, image, tags, collection, created_at})

                        return { error }
                    })
                }

                return { error: { message: error, reason: "user" } }
            })
        }
       
        return { error : { message: "bookmark already added", reason: "user" } }
    },



    addCollection(name){

        const collection = this.collections.find(collection => collection == name)

        if(!collection){

            return supabase.from("Collections").insert({ name: name }).then(({ error }) => {
    
                if(!error) this.collections.push(name)

                return { error }
            })
        }

        return { error : { message: "collection already added", reason: "user" } }
    },



    addTag(name){

        
        const tag = this.tags.find(tag => tag == name)

        if(!tag){

            return supabase.from("Tags").insert({ name: name }).then(({ error }) => {
    
                if(!error) this.tags.push(name)
       
                return { error }
            })
        }

        return { error : { message: "tag already added", reason: "user" } }
    },



    removeBookmark(url){

        return supabase.from("Bookmarks").delete().eq("url", url).eq("user_id", this.userId).then(({ error }) => {

            if(!error) this.bookmarks = this.bookmarks.filter(bookmark => bookmark.url != url)

            return { error }
        })
    },



    removeCollection(name){

        return supabase.from("Collections").delete().eq("name", name).eq("user_id", this.userId).then(({ error }) => {

            if(!error){

                return supabase.from("Bookmarks").update({ collection: null }).eq("user_id", this.userId).eq("collection", name).then(({error}) => {
    
                    if(!error){
                    
                        this.collections = this.collections.filter(collection => collection != name)
    
                        this.bookmarks.forEach(bookmark => {
    
                            if(bookmark.collection == name) bookmark.collection = null
                        })
                    }

                    return { error }
                })
            }

            return { error }
        })
    },



    removeTag(name){

        return supabase.from("Tags").delete().eq("name", name).eq("user_id", this.userId).then(({ error }) => {

            
            const pr = this.bookmarks.map(bookmark => new Promise((resolve, _) => {

                if(!bookmark.tags) resolve({ error: null })

                const tag = bookmark.tags.split("-").find(tag => tag == name)

                if(tag){

                    let tags = bookmark.tags.split("-").filter(tag => tag != name).join("-")

                    if(!tags) tags = null
                
                    resolve(supabase.from("Bookmarks").update({ tags: tags }).eq("user_id", this.userId).eq("url", bookmark.url).then(({error}) => {
                    
                        if(!error) bookmark.tags = tags
                        
                        return { error }
                    }))
                }
                
                resolve({ error: null })
            }))


            return Promise.all(pr).then(() => {
            
                this.tags = this.tags.filter(tag => tag != name)

                return { error: null }
            })
        })
    },



    getBookmarksFromCollection(name){

        const bookmarks = this.bookmarks.filter(bookmark => bookmark.collection == name)

        return { error: null, data: bookmarks }
    },



    getBookmarksFromTag(name){

        const bookmarks = []

        this.bookmarks.forEach(bookmark => {

            if(bookmark.tags){

                if(bookmark.tags.split("-").find(tag => tag == name))

                bookmarks.push(bookmark)
            }
        })

        return { error: null, data: bookmarks }        
    },



    getAllBookmarks(){

        return { error: null, data: this.bookmarks } 
    },



    getAllTags(){

        return { error: null, data: this.tags } 
    },



    getAllCollections(){

        return { error: null, data: this.collections }
    },



    addBookmarkToCollection(name, url){

        const bookmark = this.bookmarks.find(bookmark => bookmark.url == url)

        if(bookmark.collection != name){
        
            return supabase.from("Bookmarks").update({collection: name}).eq("user_id", this.userId).eq("url", url).then(({error}) => {

                if(!error) bookmark.collection = name

                return { error }
            })
        }
      
        return { error : { message: "collection already added", reason: "user" } }
    },



    addBookmarkToTag(name, url){

        const bookmark = this.bookmarks.find(bookmark => bookmark.url == url)

        if(!bookmark.tags){

            return supabase.from("Bookmarks").update({ tags: name }).eq("user_id", this.userId).eq("url", url).then(({error}) => {
            
                if(!error) bookmark.tags = name

                return { error }
            })
        } 
            
        const tag = bookmark.tags.split("-").find(tag => tag == name)

        if(!tag){

            const tags = [ ...bookmark.tags.split("-"), name ].join("-")
        
            return supabase.from("Bookmarks").update({ tags: tags }).eq("user_id", this.userId).eq("url", url).then(({error}) => {
            
                if(!error) bookmark.tags = tags

                return { error }
            })
        }
       
        return { error : { message: "tag already added", reason: "user" } }
    },



    setBookmarkAsFavorite(url){

        return supabase.from("Bookmarks").update({favorite: true}).eq("user_id", this.userId).eq("url", url).then(({error}) => {

            if(!error){

                const bookmark = this.bookmarks.find(bookmark => bookmark.url == url)
    
                bookmark.favorite = true
            }

            return { error }
        })
    },



    unsetBookmarkAsFavorite(url){

        return supabase.from("Bookmarks").update({favorite: false}).eq("user_id", this.userId).eq("url", url).then(({error}) => {

            if(!error){

                const bookmark = this.bookmarks.find(bookmark => bookmark.url == url)
    
                bookmark.favorite = false
            }

            return { error }
        })
    },



    getFavoriteBookmarks(){

        const bookmarks = this.bookmarks.filter(bookmark => bookmark.favorite == true)

        return { error: null, data: bookmarks }
    },



    removeBookmarkFromTag(name, url){

        const bookmark = this.bookmarks.find(bookmark => bookmark.url == url )

        const tags = bookmark.tags.split("-").filter(tag => tag != name).join("-")

        return supabase.from("Bookmarks").update({tags: tags}).eq("user_id", this.userId).eq("url", url).then(({error}) => {

            if(!error) bookmark.tags = tags

            return { error }
        })
    },



    removeBookmarkFromCollection(url){

        const bookmark = this.bookmarks.find(bookmark => bookmark.url == url)

        return supabase.from("Bookmarks").update({collection: null}).eq("user_id", this.userId).eq("url", url).then(({error}) => {

            if(!error) bookmark.collection = null
            
            return { error }
        })
    }

}



export { lib }

