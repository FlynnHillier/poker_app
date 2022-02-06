const express = require("express")

function api_open_handler(mongoClient,globals){


    let api_open_router = express.Router()

    //** ROUTES **


    const signup = require("./routes/signup.js")(mongoClient,globals)
    const login = require("./routes/login.js")(mongoClient,globals)


    api_open_router
        .use("/login",login)
        .use("/signup",signup)
    

    return api_open_router
}



module.exports = api_open_handler