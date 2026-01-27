const {Schema, model} = require('mongoose');
const bcrypt = require('bcrypt');

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

// Hash password before saving (promise style; no `next` arg needed)
studentSchema.pre('save', async function() {
    if (!this.isModified('password')) {
        return; // Skip if password unchanged
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Add method to compare passwords during login
studentSchema.methods.comparePassword = function(plainPassword) {
    return bcrypt.compare(plainPassword, this.password);
};

module.exports = model('Student', studentSchema);