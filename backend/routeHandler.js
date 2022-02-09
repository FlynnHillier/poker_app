const cookieParser = require("cookie-parser")
const sessions = require("express-session")
const express = require("express")
const path = require("path")
const bodyparser = require("body-parser")
const MongoStore = require('connect-mongo');


function route_handler(mongoose_instance,app,config){

    app.use(bodyparser.urlencoded({ extended: true }))
    app.use(bodyparser.json())
    app.use(cookieParser())


    




    //** ROUTES **

    
    app.use(sessions({
        secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
        saveUninitialized:true,
        cookie: { maxAge: 1000 * 60 * 60 *24 },
        resave: false,
        store: MongoStore.create({
            mongoUrl:config.mongo.access_uri,
            ttl: 60*60*24*14,
            autoRemove: 'interval',
            autoRemoveInterval: 15
        })
    }))



    const api_handler = require("./api/apiHandler.js")(mongoose_instance,config)
    app.use("/api",api_handler)
    app.use(express.static(config.directories.static))
    app.use("*",(req,res)=>{
        res.status(404).send("404")
    })


}



module.exports = route_handler