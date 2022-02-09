const cookieParser = require("cookie-parser")
const sessions = require("express-session")
const express = require("express")
const path = require("path")
const bodyparser = require("body-parser")


function route_handler(mongoClient,app,globals){

    app.use(bodyparser.urlencoded({ extended: true }))
    app.use(bodyparser.json())
    app.use(cookieParser())


    




    //** ROUTES **

    
    app.use(sessions({
        secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
        saveUninitialized:true,
        cookie: { maxAge: 1000 * 60 * 60 *24 },
        resave: false
    }))



    const api_handler = require("./api/apiHandler.js")(mongoClient,app,globals)
    app.use("/api",api_handler)




    app.use(express.static(globals.static_dir))


    


    app.use("*",(req,res)=>{
        res.status(404).send("404")
    })


}



module.exports = route_handler