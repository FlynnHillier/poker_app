const express = require("express")
const path = require("path")
const bodyparser = require("body-parser")


function api_authorised_handler(mongoClient,globals){





    //** ROUTES **
    let api_authorised_router = express.Router()
    

    const user = require("./routes/user.js")(mongoClient,globals)
    const base = require("./routes/_.js")(mongoClient,globals)

    api_authorised_router
        .use((req,res,next)=>{
            if(!req.session.isAuth){
                res.status(200).send({
                    result:false,
                    next_url:"/login"
                })
            } else{
                next()
            }
        }) 
        .use("/user",user)
        .use("/",base)
    

    return api_authorised_router
}



module.exports = api_authorised_handler