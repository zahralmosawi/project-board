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
        type:String,
        enum: ['academic','professional','personal'],
        required:true
    },
    tags:[String],
    date:{
        type:Date,
        default:Date.now
    },
    attachments:[String],
    creator:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Project = mongoose.model('Project', projectSchema)
module.exports = Project