
import { createApp } from "vue"

import Home from "./home/Home.vue"

import Signin from "./signin/Signin.vue"

import Signup from "./signup/signup.vue"

import { supabase } from "./supabaseConfig"

const router = {

    container: document.querySelector("#container"),

    app: null,

    "/signin": async function(e){

        if(this.app) this.app.unmount()

        this.container.innerHTML = ""

        this.app = createApp(Signin)

        this.app.mount("#container")

        if(!e) history.pushState({path: "/signin"}, "", "/signin")
    },

    "/signup": function(e){

        if(this.app) this.app.unmount()

        this.container.innerHTML = ""

        this.app = createApp(Signup)

        this.app.mount("#container")

        if(!e) history.pushState({path: "/signup"}, "", "/signup")
    },

    "/": async function(e){

        const { data } = await supabase.auth.getSession()

        if(data.session){

            if(this.app) this.app.unmount()
    
            this.container.innerHTML = ""

            this.app = createApp(Home)

            this.app.mount("#container")

            if(!e) history.pushState({path: "/"}, "", "/")
        }
        else{

            this["/signin"]()
        }
    }
}

export { router }

