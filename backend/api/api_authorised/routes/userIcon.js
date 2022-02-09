const path = require("path")
const express = require("express")


//NOT IN USE


module.exports = function(mongoose_instance,config){


let Router = express.Router()


//** LOGIN **
Router
    .route("/")
    .get((req,res)=>{

        res.status(200).send({
            result:true,
            
        })
        
        
    })


//KEEP BOTTOM
return Router}