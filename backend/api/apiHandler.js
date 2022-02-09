const express = require("express")
const path = require("path")
const bodyparser = require("body-parser")
const sessions = require("express-session")


function api_handler(mongoClient,app,globals){



    //** ROUTES **
    let api_router = express.Router()


    const open = require("./api_open/api_openHandler.js")(mongoClient,globals)
    const authorised = require("./api_authorised/api_authorisedHandler.js")(mongoClient,globals)

    api_router
        .use("/open",open)
        .use("/authorised",authorised)
    
    
    return api_router

}



module.exports = api_handler