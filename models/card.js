const mongoose = require('mongoose');

const card = mongoose.Schema({
    title:{
        type:mongoose.SchemaTypes.String,
        require:true,
    },
    idColumn:{
        type:mongoose.SchemaTypes.ObjectId,
        require:true,
    },
    feedBack:{
        commentList:{
            type:mongoose.SchemaTypes.Array,
        },
        likeList:{
            type:mongoose.SchemaTypes.Array
        },
        likeAmount:{
            type:mongoose.SchemaTypes.Number,
            require:true,
        }
    }
})

module.exports = mongoose.model('card',card)