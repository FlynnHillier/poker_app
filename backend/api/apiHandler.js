const express = require("express")
const path = require("path")
const bodyparser = require("body-parser")
const sessions = require("express-session")


function api_handler(mongoose_instance,config){



    //** ROUTES **
    let api_router = express.Router()
    


    api_router.use(sessions({
        secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
        saveUninitialized:true,
        cookie: { maxAge: 1000 * 60 * 60 *24 },
        resave: false
    }))



    const open = require("./api_open/api_openHandler.js")(mongoose_instance,config)
    const authorised = require("./api_authorised/api_authorisedHandler.js")(mongoose_instance,config)

    api_router
        .use("/open",open)
        .use("/authorised",authorised)
    
    
    return api_router

}



module.exports = api_handler