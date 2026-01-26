const {Schema, model} = require('mongoose');

const studentSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    salt:{
        type:String,
    },
    role:{
        type:String,
        enum:['student', 'admin','recruiter'],
        required:true,
        default:'student',
    }
},{timestamps:true});

module.exports = model('Student', studentSchema);