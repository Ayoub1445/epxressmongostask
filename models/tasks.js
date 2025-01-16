const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    }
});
// to make date visible
module.exports = mongoose.model('Task',schema);