const {join} = require("path")

module.exports = {


    init_settings:{
        port : 5000,
        listen_retry_attempts : 3,
        listen_retry_delay : 4000,
        listen_silent : true,
        mongoClient_connection_config: {
            connectTimeoutMS: 5000,
            serverSelectionTimeoutMS: 2000
        }
    },

    global_config:{

        directories:{
            backend:join(process.cwd(),"backend"),
            static:join(process.cwd(),"static"),
            routes:join(process.cwd(),"backend","routes"),
        },

        mongo:{
            access_uri:"mongodb+srv://temporary:temp@cluster0.aq57b.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            mongoose_models: require("./mongoose_models.js")
        }
    }



}