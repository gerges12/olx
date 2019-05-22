var express = require('express');
var router = express.Router();
var posts = require('../models/posts') ;
var user = require('../models/user') ;



/*var csrf = require('csurf') ;
var csrfProtection = csrf({ cookie: true })
router.use(csrfProtection) ;*/

var path  = require("path") ;
var fs = require('fs');

const fileUpload = require('express-fileupload');

router.use(fileUpload());

router.get('/' , function(req, res, next) {
       
    posts.find().limit(9).  sort({ date: -1 }).
    exec( function(err, posts){
        if(err){
          console.log(err);
        } else{
            res.render('shop/index',{
                "posts": posts});
        }
    }) ; 
    
  /*  posts.find(function(err, posts){
        if(err){
          console.log(err);
        } else{
            res.render('shop/index',{
                "posts": posts});
                console.log(posts) ;
        }
    }) ; */
});
router.get('/page/:id' , function(req, res, next) {
    var page = req.params.id ;
    if(page==1){
        res.redirect("/") ;
    }
    else{
    posts.paginate({},{page:page ,  sort:{ date: -1 }, limit:5},function(err, news){
        if(err){
          console.log(err);
        } else{
            res.render('shop/index',{
                "posts": news.docs ,"npage":news.pages});
                console.log(news) ;
        }
    }) ;

       }
});

router.get('/delete/:id' ,function(req, res, next) {
    
    cuser = req.user.id ;
    user.findByIdAndUpdate(
        cuser,
        {$pull: {"bookmarks":req.params.id }}, 
        {new: true},
        function(err,user){
            if(err){
                res.json({error :err}) ; 
            }
            else res.redirect("/user/profile") ;
       }); 
});

router.get('/detail/:id' ,function(req, res, next) {

    var thingtype =   req.params.id ;
    posts.findOneAndUpdate({_id :thingtype}, {$inc : {'view' : 1}}).exec(function (err, doc) {
           
        posts.
        findOne({_id: req.params.id}).
        populate("user").
        exec(function (err, posts) {
      
          if (err) return err;
          res.render('shop/show' , {user:posts.user , posts:posts }); 
      
        });  
      });
});

router.get('/star/:id' ,function(req, res, next) {
    
    cuser = req.user.id ;
    user.findByIdAndUpdate(
        cuser,
        {$push: {"bookmarks":req.params.id }}, 
        {new: true},
        function(err,user){
            if(err){
                res.json({error :err}) ; 
            }
            res.redirect(req.get('referer'));

       }); 
});

router.get('/user/adminpost'  , isLoggedIn , function(req, res, next) {
  
    res.render('shop/post' );
 });

 router.get('/searchg' ,function(req, res, next) {
    var g = req.body.general ;
      
    console.log("hhhh"+g) ;

    posts.find({$text:{$search:"sonyz1"}}).exec(function(err, docs) {  
        res.render('shop/index',{
            "posts": docs});
  }); });

 router.post('/search' ,function(req, res, next) {
    var thingtype = req.body.ntype ;
    var country    = req.body.country;
    var fp = req.body.fp;  
    var ep = req.body.ep;   
    var statue = req.body.statue;
    var transtype = req.body.stype;
      
     res.redirect('/search/' + thingtype+ '/' + country+ '/' + fp+ '/'+ ep+ '/' + statue+ '/' + transtype);
});

 router.get('/search/:t/:c/:fp/:ep/:s/:tt' , function(req, res, next) {
     var type = req.params.t ;
     var country = req.params.c ;
     var pricef = req.params.fp ;
     var statue = req.params.s ;
     var transtype = req.params.tt ;

     var priceeend = req.params.ep ; 
         
     if (pricef=="all" && priceeend=="all" && country!=="all" ){

        posts.find({country:country ,newstype:type ,
            statue:statue ,
            transtype:transtype}, function(err, data){
            res.render('shop/index',{
                "posts": data});
         }); 
        
     }
     else if (pricef=="all" && priceeend=="all" && country=="all"){
        console.log("9") ;

        posts.find({newstype:type ,
            statue:statue ,
            transtype:transtype}, function(err, data){
            res.render('shop/index',{
                "posts": data});
         }); 
        
     }
     else if (country=="all"){

        posts.find({newstype:type ,
           price:{ $gt: pricef, $lt: priceeend } ,statue:statue ,
           transtype:transtype}, function(err, data){
           res.render('shop/index',{
               "posts": data});
        }); 
       }

     else {

     posts.find({country:country ,newstype:type ,
        price:{ $gt: pricef, $lt: priceeend } ,statue:statue ,
        transtype:transtype}, function(err, data){
        res.render('shop/index',{
            "posts": data});
     }); 
    }
    

});


 router.post('/addpost' ,function(req, res, next) {
    var thingtype = req.body.ntype ;
        var statue = req.body.statue;

    var country    = req.body.country;
    var price = req.body.price;   //statue
    var statue = req.body.statue;
    var transtype = req.body.stype;

    var desc1 = req.body.desc;
    var desc2 = req.body.body;



   var file = req.files.foo ;
    var date = new Date() ;
    
    console.log(file.name) ;

    
    file.mv(path.join(__dirname ,"/uploads/" + file.name ), err => { 
        if (err) throw err;
        console.log("file moved succ" );
        });

        posts.create({
            "newstype": thingtype,
            "country": country,
            "price": price ,
            "statue": statue ,
            "transtype": transtype ,
            "body": desc2 ,
            "desc": desc1 ,

            "date":date ,
            "file":file.name ,
            "user":req.user ,



          },  function(err, post){
            if(err){
                res.send('There was an issue submitting the post');
            } else {
                res.redirect('/') ; 
                console.log("the new post is" +post) ;
            }
        });
    }); 
 


    
    router.get('/user/inf', isLoggedIn ,function(req, res, next){
        
    
        res.render('user/inf'  );
    });
    
      router.post('/inf/:id' , function(req, res, next){
        var patid = req.params.id ;
    
        var name = req.body.name ;
        var phone = req.body.phone ;
        var bday = req.body.bday ;
        var city = req.body.city ;
    
        var file = req.files.foo
    
    file.mv(path.join(__dirname ,"/uploads2/" + file.name ), err => { 
    if (err) throw err;
    console.log("file moved succ" );
    });
        console.log(req.files.foo);
    
            user.findByIdAndUpdate(
            patid,
            {$set: {"name": name,
            "phone": phone,
            "bday": bday,
            "city": city ,
            "ph" :file.name
            
          }}, 
            {new: true},
            function(err,user){
                if(err){
                    res.json({error :err}) ; 
                }
                console.log(user) ;
    
            });
            res.redirect('/') ;
    }) ;

  function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
         return next() ;
    }
    res.redirect('/user/signin') ;
}
function notLoggedIn(req, res, next){
   if(!req.isAuthenticated()){
        return next() ;
   }
   res.redirect('/') ;
}
module.exports = router;
