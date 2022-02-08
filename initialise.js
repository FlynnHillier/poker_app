function globals_init(globals_dir,globals_config){
    return new Promise((resolve,reject)=>{
    
            const {writeFileSync} = require("fs")
            const {join} = require("path")

        try{
            writeFileSync(join(globals_dir,"globals.json"),JSON.stringify(globals_config))
            resolve({message:`Successfully updated '${join(globals_dir,"globals.json")}' with config: \n ${globals_config}`})
        } catch(err){
            reject({message:`Error writing to file '${join(globals_dir,"globals.json")}'`,error:err})
        }  
    })
}


function establish_mongoDB_connection(mongoose_object,mongoDB_access_uri,mongoose_boot_config){
    return new Promise((resolve,reject)=>{

        mongoose_object.connect(mongoDB_access_uri,mongoose_boot_config).then(()=>{
            console.log("then")
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
const { MongoClient } = require("mongodb")

const mongoose = require("mongoose")


//**SETTINGS VARIABLES**

//express
const app = express()
const PORT = 5000
const listen_retry_attempts = 3
const listen_retry_delay = 4000
const listen_silent = true

//mongo
const mongoDB_access_uri = "mongodb+srv://temporary:temp@cluster0.aq57b.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const mongoClient_connection_config = {
    connectTimeoutMS: 5000,
    serverSelectionTimeoutMS: 2000
}


//const mongoClient = new mongoose(mongoDB_access_uri,mongoClient_connection_config)

//globals
const GLOBALS_DIR = process.cwd()
const GLOBALS_CONFIG = {
    backend_dir:join(process.cwd(),"backend"),
    static_dir:join(process.cwd(),"static"),
    routes_dir:join(process.cwd(),"backend","routes"),
    mongoDB_access_uri:mongoDB_access_uri
}



//**INITIALISE **
const loading_message_interval = loading_message("initialising application")
const init_result = new Promise((resolve,reject)=>{

    globals_init(GLOBALS_DIR,GLOBALS_CONFIG)
    .then((resolution)=>{

        establish_mongoDB_connection(mongoose,mongoDB_access_uri,mongoClient_connection_config)
        .then((resolution)=>{

            listen(app,PORT,listen_retry_attempts,listen_retry_delay,listen_silent)
            .then((resolution)=>{
                resolve({message:"application successfully initialised",info:{port:PORT,mongoDB_access_uri:mongoDB_access_uri,globals_dir:GLOBALS_DIR,globals_config:GLOBALS_CONFIG}})
            })
            .catch((rejection)=>{
                reject(rejection)
            })

        })
        .catch((rejection)=>{ //mongoDB connect rejection
            reject(rejection)
        })

    })
    .catch((rejection)=>{ //globals_init rejection
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
    console.log(resolution.info)


    try{
    
    require(join(GLOBALS_CONFIG.backend_dir,"RouteHandler.js"))(mongoose,app,GLOBALS_CONFIG)
    }
    catch(err){
        throw err
    }
    
    loading_message(`listening on port ${PORT}`)

})
.catch((rejection)=>{
    throw rejection
    //console.log(`initilisation failure: '${rejection.message}'`)
})