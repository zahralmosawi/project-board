const mongoose = require('mongoose')
const projectSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    },
    creator:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'creator'
    }
    // file:
})

const Project = mongoose.model('Project', projectSchema)
module.exports = Project