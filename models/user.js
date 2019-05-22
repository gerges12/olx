var mongoose = require('mongoose') ;
var Schema = mongoose.Schema ;
var bcrypt = require('bcrypt-nodejs') ;

var userSchema = new Schema({
    name:{type:String, require: true} ,
    email:{type:String, require: true} ,
    password:{type:String, require: true} ,
    name:{type:String, require: true} ,
    phone:{type:Number, require: true} ,
    city:{type:String, require: true} ,
    bday:{type:Date, require: true} ,
    isadmin:{type:String , require:true} ,
    ph:{type:String, require: true} ,
    bookmarks: [{ type: Schema.Types.ObjectId, ref: 'posts' }] ,

}) ;

userSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5) ,null) ;
} ;

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password,this.password) ;
} ;



module.exports = mongoose.model('User',userSchema) ;