const mongoose = require('mongoose');

const column = mongoose.Schema({
    title:{
        type:mongoose.SchemaTypes.String,
        require:true,
    },
    dayCreated:{
        type:mongoose.SchemaTypes.Date,
        require:true
    },
    boardId:{
        type:mongoose.SchemaTypes.ObjectId,
        require:true
    }
})

module.exports=mongoose.model('Column',column)