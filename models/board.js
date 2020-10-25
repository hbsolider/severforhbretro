const mongoose = require('mongoose');

const board = mongoose.Schema({
    title:{
        type:mongoose.SchemaTypes.String,
        require:true
    },
    dayCreated:{
        type:mongoose.SchemaTypes.Date,
        default:Date.now()
    },
    cardAmount:{
        type:mongoose.SchemaTypes.Number,
        require:true
    },
    userId:{
        type:mongoose.SchemaTypes.ObjectId,
        require:true
    }
})

module.exports = mongoose.model('Board',board);