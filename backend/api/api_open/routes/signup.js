const express = require("express")
const path = require("path")

function signup(mongoClient,config){

    let Router = express.Router()
    // ** base **
    Router 
        .route("/")
        .post((req,res)=>{

            if(!req.body.signup_username || !req.body.signup_password){
                res.status(503).send("Request body not satisfactory")
            }



            const username = req.body.signup_username
            const password = req.body.signup_password


            mongoClient.connect().then((connection_result)=>{
                const collection = mongoClient.db("users").collection("standard_users")


                collection.findOne({username:username}).then((username_found_result) => {
                    if(username_found_result){
                        res.status(403).json({err:"User creation error, user already exists",message:"That username is unavailable"})
                    } else{

                        collection.insertOne({username:username,password:password}).then((user_creation_result)=>{

                            res.status(200).send({next_url:"/signup/success"})

                        }).catch((err)=>{
                            res.send(503).json({err:err,"message":"Error creating user within database. Database error"})
                        })


                    }
                })


            }).catch((err)=>{
                res.status(503).json({message:"Error establishing connection to database.",err:err})
            })
        })


    // ** /SUCCESS  **
    Router.route("/success")
        .get((req,res)=>{
            res.status(200).sendFile(path.join("signup","success","index.html"))
        })


    // KEEP BOTTOM
    return Router
}


module.exports = signup