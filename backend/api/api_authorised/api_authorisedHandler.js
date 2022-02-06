const express = require("express")
const path = require("path")
const bodyparser = require("body-parser")


function api_authorised_handler(mongoClient,globals){





    //** ROUTES **
    let api_authorised_router = express.Router()
    

    const users = require("./routes/user.js")(mongoClient,globals)
    

    api_authorised_router
        .use((req,res,next)=>{
            if(!req.session.isAuth){
                res.status(401).send()
            } else{
                next()
            }
        }) 
        .use("/user",users)
    

    return api_authorised_router
}



module.exports = api_authorised_handler