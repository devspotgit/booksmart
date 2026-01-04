
import { createApp } from "vue"

import Home from "./home/Home.vue"

import Signin from "./signin/Signin.vue"

import Signup from "./signup/signup.vue"

const router = {

    container: document.querySelector("#container"),

    app: null,

    "/signin": function(){

        document.title = "BookSmart - Signin"

        if(this.app) this.app.unmount()

        this.container.innerHTML = ""

        this.app = createApp(Signin)

        this.app.mount("#container")
    },

    "/signup": function(){

        document.title = "BookSmart - Signup"

        if(this.app) this.app.unmount()

        this.container.innerHTML = ""

        this.app = createApp(Signup)

        this.app.mount("#container")
    },

    "/": function(){

        document.title = "BookSmart - Home"

        if(this.app) this.app.unmount()

        this.container.innerHTML = ""

        this.app = createApp(Home)

        this.app.mount("#container")
    }
}

export { router }

