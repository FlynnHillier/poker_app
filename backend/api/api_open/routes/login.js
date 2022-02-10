const path = require("path")
const express = require("express")
const { mongo } = require("mongoose")

module.exports = function(mongoose_instance,config){


let Router = express.Router()


//** LOGIN **
Router
    .route("/")
    .get((req,res)=>{

        res.status(200).sendFile(path.join(config.directories.static,"login","index.html"))
    })
    .post((req,res)=>{
        const username = req.body.username
        const password = req.body.password

        
        if(!username || !password){
            res.status(403).send()
            return
        }


        

       config.mongo.mongoose_models.user.findOne({username:username}).then((userInfo)=>{
            if(userInfo){


                if(userInfo.password == password){

                    req.session.userID = userInfo.username
                    req.session.isAuth = true
                    res.status(200).send({
                        result:true,
                        next_url:"/dashboard",
                        message:"Successfully logged in"
                    })
                } else{
                    res.status(200).send({
                        result:false,
                        message:"password is not correct"
                    })
                }

            } else{

                res.status(200).send({
                    result:false,
                    message:"user not found"
                })

            }
        
        })
        .catch((err)=>{
            console.log("error:!")
            console.log(err)
            res.status(503).send({message:"error searching database for login credentials",error:err})
        })


    })


//KEEP BOTTOM
return Router}