
const mongoose = require("mongoose")

const model = mongoose.model
const schema = mongoose.Schema

mongoose_models = {

    user:model("user",new schema({username:'string',password:'string'})),

}






module.exports = mongoose_models