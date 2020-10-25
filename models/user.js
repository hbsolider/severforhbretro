const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    dayCreated:{
        type:mongoose.SchemaTypes.Date,
        default:Date.now(),
    },
});

//Export the model
module.exports = mongoose.model('User', userSchema);