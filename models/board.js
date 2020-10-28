const mongoose = require('mongoose');

const board = mongoose.Schema({
    title:{
        type:mongoose.SchemaTypes.String,
        required:true
    },
    dayCreated:{
        type:mongoose.SchemaTypes.Date,
        default:Date.now()
    },
    cardAmount:{
        type:mongoose.SchemaTypes.Number,
    },
    userId:{
        type:mongoose.SchemaTypes.ObjectId,
        required:true
    },
    isDelete:{
        type:mongoose.SchemaTypes.Boolean,
        default:0
    }
})

module.exports = mongoose.model('Board',board);