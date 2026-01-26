const {Schema,model}= require('mongoose');

const jobSchema =new Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    skills:{
        type:[String],
        required:true,
    },
    phoneNo:{
        type:String,
        required:true,
    }
});

module.exports = model('Job',jobSchema);