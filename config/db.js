const mongoose = require("mongoose")

async function conntectToDB(){ 
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connected to Database")
    }
    catch(error){
        console.log("Error Occured",error)
    }
}

module.exports = conntectToDB