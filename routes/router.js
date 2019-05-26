var express = require('express');
var router=express.Router();
var User=require('../models/user');

router.get('/',function(req,res){
    res.sendFile(__dirname + '/views/index.html');
})

router.post('/',function(req,res,next){
    if(req.body.password != req.body.passwordConf){
        var err=new Error('Password do not match.')
        err.status=400;
        res.send('Password do not match.')
        return next(err);
    }

    if(req.body.email && req.body.username && req.body.password && req.body.passwordConf){
        var userData={
            email:req.body.email,
            username:req.body.username,
            password:req.body.password,
            passwordConf:req.body.passwordConf
        }

 User.create(userData,function(err, user){
     if(err){
         throw err;
     }
     else{
         req.session.userID=user._id //check this dot
         return res.redirect('/admin');
     }
 })       
 
    }
})

router.get('/admin',function(req,res,next){
    if(req.session.userID){
User.findById(req.session.userID).exec(function(err,user){
        if(err){
            return next(err);
        }else{
            if(user ==null){
                err.status=400;
                return next(err);

            }else{
                return res.send('<h2>HELLO ' + user.username + '!!</h2> <a href= "/logout" >Logout</a>');
            }
        
            }
    })    
    }})

    router.get('/logout',function(req,res,next){
        if(req.session){
            req.session.destroy(function(err){
                if(err){
                    return next(err);
                }else{
                    return res.redirect('/');
                }
            })
        }
    })

  
    module.exports=router;