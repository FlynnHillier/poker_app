function establish_mongoDB_connection(mongoose_object,mongoDB_access_uri,mongoose_boot_config){
    return new Promise((resolve,reject)=>{

        mongoose_object.connect(mongoDB_access_uri,mongoose_boot_config).then(()=>{
            resolve("Successfully established a connection to mongoDB client.")
            //mongoClient.close()
        }).catch((error)=>{
            console.log("catch")
            reject({message:`The mongoDB client was unresponsive after: ${mongoose_boot_config.serverSelectionTimeoutMS}ms.`,error:error})
        })



    })



}


function listen(app,PORT = 5000,attempts = 3,retryDelay=10000,silent = true){

    return new Promise ((resolve,reject)=>{        
        if(attempts <= 0){
            reject(`given '<= 0' attempts, no attempt at a connection to PORT ${PORT} was made.`)
        } else if(PORT <= 0 || PORT > 9999 || typeof PORT != "number"){ 
            reject(`invalid PORT '${PORT}'. Must be of type 'number' of minimum 1 , maximum 9999.`)
        }else{

            let totalAttempts = 1
            if(!silent){console.log(`Attempt ${totalAttempts} to listen on PORT ${PORT}......`)}
            const server = app.listen(PORT)


            server.on("listening", () => {
                let message = `After ${totalAttempts} attempts, Successfully started listening on PORT ${PORT}...`
                resolve({message:message})    
            })

            server.on("error", async (error) => {
                totalAttempts += 1

                if(totalAttempts > attempts) {
                    let message = `After ${totalAttempts - 1} attempts, PORT ${PORT} was still unaccessible.`
                    reject({message:message})
                } else{


                if(error.code === "EADDRINUSE"){
                    if(!silent){console.log(`Failure connecting to PORT ${PORT}, already in use.`)}
                }else{
                    if(!silent){console.log(`UNEXPECTED ERROR: '${error}'`)}
                }

                let message = `Attempt ${totalAttempts} to listen on PORT ${PORT}......`
                if(!silent){console.log(message)}
                    
                await setTimeout(()=>server.listen(PORT),retryDelay)
            }
            })
            }
        })
}


function loading_message(message){
    let loading_stage = 0
    return setInterval(() => {
        loading_stage >= 4 ? loading_stage = 0 : loading_stage++
        process.stdout.write(`\r\x1b[K${message}${".".repeat(loading_stage)}`)
    }, 500);
    
}


//**REQUIRE MODULES**
const {join} = require("path")
const express = require("express")
const mongoose = require("mongoose")
const app = express()


//**CONFIG**
const { init_settings, global_config } = require("./config.js")




//**INITIALISE **
const loading_message_interval = loading_message("initialising application")
const init_result = new Promise((resolve,reject)=>{
        establish_mongoDB_connection(mongoose,global_config.mongo.access_uri,init_settings.mongoClient_connection_config)
        .then((resolution)=>{

            listen(app,init_settings.port,init_settings.listen_retry_attempts,init_settings.listen_retry_delay,init_settings.listen_silent)
            .then((resolution)=>{
                resolve({message:"application successfully initialised",config:{init:init_settings,global:global_config}})
            })
            .catch((rejection)=>{
                reject(rejection)
            })

        })
        .catch((rejection)=>{ //mongoDB connect rejection
            reject(rejection)
        })

    })
.finally(()=>{
    clearInterval(loading_message_interval)
    process.stdout.clearLine()
    process.stdout.cursorTo(0)
})
.then((resolution)=>{
    console.log(resolution.message)
    console.log("\n**Init settings**:\n",resolution.config.init)
    console.log("\n**Global settings**:\n",resolution.config.global)


    try{
    
    require(join(global_config.directories.backend,"RouteHandler.js"))(mongoose,app,global_config)
    }
    catch(err){
        throw err
    }
    
    loading_message(`listening on port ${init_settings.port}`)

})
.catch((rejection)=>{
    throw rejection
    //console.log(`initilisation failure: '${rejection.message}'`)
})