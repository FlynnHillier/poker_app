const path = require("path")
const express = require("express")

module.exports = function(mongoClient,config){


let Router = express.Router()


//** LOGIN **
Router
    .route("/")
    .get((req,res)=>{

        res.status(200).send(req.session.userID)
        
        
    })


//KEEP BOTTOM
return Router}