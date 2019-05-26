var express=require('express');
var bodyParser=require('body-parser');
var mongoose=require('mongoose');
var sessions=require('express-session');
var MongoStore=require('connect-mongo')(sessions);
var app=express();

//to connect with mongodb
var options={
    user:'myTester',
    pass:'xyz123'
}

mongoose.connect('mongodb://localhost:27017/ecommercedb',options);
var db=mongoose.connection;

//handle mongodb error
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',function(){
    console.log('we are connected.')
})

//use sessions for tacking logins
app.use(sessions({
    secret:'aasshhh',
    resave:true,
    saveUninitialized:false,
    store:new MongoStore({
    mongooseConnection: db
    })
}))

//parse incoming request
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))


//server static file from template
/* app.get('/',function(req,res){
    res.sendFile(__dirname+'/views/index.html')
}); */

//or

app.use(express.static(__dirname+'/views')) 

//Includes routes
var routes=require('./routes/router');
app.use('/',routes);



app.listen(3000,function(){
    console.log('this server is running at port 3000!!')
})

