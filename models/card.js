const mongoose = require('mongoose');

const card = mongoose.Schema({
    title:{
        type:mongoose.SchemaTypes.String,
        required:true,
    },
    idColumn:{
        type:mongoose.SchemaTypes.ObjectId,
        required:true,
    },
    feedBack:{
        commentList:{
            type:mongoose.SchemaTypes.Array,
        },
        likeList:{
            type:mongoose.SchemaTypes.Array
        }
    },
    index:{
        type:mongoose.SchemaTypes.Number,
        required:true
    }
})

module.exports = mongoose.model('card',card)