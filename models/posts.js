var mongoose = require('mongoose') ;
var Schema = mongoose.Schema ;
var mongoosePaginate = require('mongoose-paginate');
 


var schema = new Schema({
    newstype:{type:String, require: true} ,
    country:{type:String, require: true} ,
    price:{type:Number, require: true} ,
    view:{type:Number,  default: 0 } ,
    viewers_id:[{type:String}] ,


    statue:{type:String, require: true} ,
    transtype:{type:String, require: true} ,

    body:{type:String, require: true} ,
    desc:{type:String, require: true} ,

    file:{type:String, require: true} , 
    date:  {type:Date, require: true} ,
    user:{ type: Schema.Types.ObjectId , ref:'User'} ,
    }) ;

schema.plugin(mongoosePaginate);


module.exports = mongoose.model('posts',schema) ;