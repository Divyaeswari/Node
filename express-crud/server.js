var createError=require("http-errors")
var express=require("express")
var path=require("path")//to access file paths
var cookieParser=require("cookie-parser")
var logger=require("morgan")// development error
var expressValidator=require("express-validator")//form validation
var flash=require("express-flash")//display warning, error messages
var session=require("express-session")//info user to server
var bodyParser=require("body-parser")//to get the data from form while using post method
var mysql=require("mysql")//to connect mysql database
var connection=require('./lib/dbconfig')
var indexRouter=require('./routes/index')
var usersRouter=require('./routes/users')
var customersRouter=require('./routes/customers')

var app=express()
//view engine setup:
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'public')));

app.use(session({
    secret:'12345cat',
    resave:false,
    saveUninitialized:true,
    cookie:{maxAge:60000}
}))

app.use(flash());
app.use(expressValidator());
app.use('/',indexRouter);
app.use('/users',usersRouter);
app.use('/customers',customersRouter);

//catch  404 and forward to error handler
app.use(function(err,req,res,next){
    //set locals, only providing error in development

    res.locals.message = err.message;
    res.locals.error = req.app.get('env')==='development'?err:{};

    //render the error page

    res.status(err.status || 500);
    res.render('error');
});

//port must be set to 3000 because incoming http request are routed from port 80 to 8000

app.listen(3000,function(){
    console.log('Node app is running on port 3000');
});

module.exports = app;