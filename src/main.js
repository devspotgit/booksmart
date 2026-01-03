
import { router } from "./router.js"

const container = document.querySelector("#container")

let currentPath = location.pathname

router[currentPath]()

history.replaceState({path: currentPath}, "", currentPath)

container.addEventListener("click", e => {

    if(e.target.tagName == "A" && e.target.hostname == location.hostname){

        e.preventDefault()

        if(currentPath != e.target.pathname){

            currentPath = e.target.pathname    
    
            router[currentPath]()
        }
    }
})

window.addEventListener("popstate", e => {

    router[e.state.path]("event")
})


