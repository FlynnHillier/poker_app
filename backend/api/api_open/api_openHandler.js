const express = require("express")

function api_open_handler(mongoose_instance,config){


    let api_open_router = express.Router()

    //** ROUTES **


    const signup = require("./routes/signup.js")(mongoose_instance,config)
    const login = require("./routes/login.js")(mongoose_instance,config)


    api_open_router
        .use("/login",login)
        .use("/signup",signup)
    

    return api_open_router
}



module.exports = api_open_handler