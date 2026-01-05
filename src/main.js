
import { router } from "./router.js"

import { supabase } from "./supabaseConfig.js"

const container = document.querySelector("#container")

let currentPath = null

let firstTime = true

container.addEventListener("click", e => {

    if(e.target.tagName == "A" && e.target.hostname == location.hostname){

        e.preventDefault()

        if(currentPath != e.target.pathname){

            currentPath = e.target.pathname    
    
            router[currentPath]()

            history.pushState({path: currentPath}, "", currentPath)
        }
    }
})

window.addEventListener("popstate", e => {

    currentPath = e.state.path

    router[currentPath]()
})

supabase.auth.onAuthStateChange((_, session) => {

    if(session){

        if(!firstTime){
    
            if(currentPath == null){
    
                currentPath = "/"
    
                router[currentPath](session.user)
    
                history.replaceState({path: currentPath}, "", currentPath)
            }
            else{
    
                currentPath = "/"
    
                router[currentPath](session.user)
    
                history.pushState({path: currentPath}, "", currentPath)
            }
        }
        else{

            firstTime = false
        }
    }
    else{

        if(currentPath == null){

            currentPath = location.pathname == "/" ? "/signin" : location.pathname

            router[currentPath]()

            history.replaceState({path: currentPath}, "", currentPath)
        }
        else{

            currentPath = "/signin"

            router[currentPath]()

            history.pushState({path: currentPath}, "", currentPath)
        }
    }
})


