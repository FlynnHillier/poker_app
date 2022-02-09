const path = require("path")
const express = require("express")

module.exports = function(mongoose_instance,config){


let Router = express.Router()


//** LOGIN **
Router
    .route("/")
    .get((req,res)=>{

        res.status(200).send({
            result:true,
            userID:req.session.userID
        })
        
        
    })


//KEEP BOTTOM
return Router}