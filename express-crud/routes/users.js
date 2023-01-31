// var express = require('express');
// var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// module.exports = router;

//Create crud//(file created inside routes folder)
var express=require('express');
var router=express.Router();
var connection=require('../lib/dbconfig');
//Get Home Page

router.get('/',function(req,res,next){
    connection.query('select * from userdetails order by uid desc',function(err,rows){
        if(err){
            req.flash('error',err);
            res.render('users',{page_title:"Users-Node.js",data:''});
        }
        else{
            res.render('users',{page_title:"Users.Node.js",data:rows});
        }
    });
});

//show add user form

router.get('/add',function(req,res,next){
    //render to views/users/add.ejs
    res.render('users/add',{
        title:'Add New Users',
        uname:'',
        uemail:'',
        ugender:'',
        uphoneno:'',
        ulanguage:'',
        uinterest:'',
        umessage:''
    })
})

//Add new user post action

router.post('/add',function(req,res,next){
    req.assert('uname','Name is required').notEmpty() //validate name
    req.assert('uemail','A valid email is required').isEmail() //validate email
    req.assert('uphoneno','Numbers only required').isNumeric() //validate PhoneNo
    var errors =  req.validationErrors()
    if(!errors){
        var user={
            uname:req.sanitize('uname').escape().trim(),
            uemail:req.sanitize('uemail').escape().trim(),
            ugender:req.body.ugender,
            uphoneno:req.sanitize('uphoneno').escape(),
            ulanguage:req.sanitize('ulanguage').escape(),
            uinterest:req.sanitize('uinterest').escape(),
            umessage:req.body.umessage
        }
        connection.query('insert into userdetails SET?',user,function(err,result){
            if(err){
                req.flash('error',err)
                //render to views/users/add.ejs
                res.render('users/add',{
                    title:'Add New User',
                    uname:user.uname,
                    uemail:user.uemail,
                    ugender:user.ugender,
                    uphoneno:user.uphoneno,
                    ulanguage:user.ulanguage,
                    uinterest:user.uinterest,
                    umessage:user.umessage
                })
            }
            else{
                req.flash('success','Data Added Successfully');
                res.redirect('/users')
            }
        })
    }
    else{
                //Display errors to user
                var error_msg = '';
                  errors.forEach(function(error){
                  error_msg+=error.msg+'<br>'
                }) 
                req.flash('error',error_msg)
                //using req.body.name because req.param('name') is deprecated
                res.render('users/add',{
                    title:"Add New User",
                    uname:req.body.uname,
                    uemail:req.body.uemail,
                    ugender:req.body.ugender,
                    uphoneno:req.body.uphoneno,
                    ulanguage:req.body.ulanguage,
                    uinterest:req.body.uinterest,
                    umessage:req.body.umessage
                })
            }
})


//show edit user form
router.get('/edit/(:uid)',function(req,res,next){
            connection.query('select * from userdetails where uid='+req.params.uid,function(err,rows,fields){
                if(err)
                {
                    throw err;
                }
            //If users not found
            if(rows.length<=0)
            {
                req.flash('error','Users Not found with Id='+req.param.uid)
                res.redirect('/users')

            }
            else{ // User found
                //render to views/users/edit.ejs
    res.render('users/edit',{
        title:'Edit Users',
        uid:rows[0].uid,
        uname:rows[0].uname,
        uemail:rows[0].uemail,
        ugender:rows[0].ugender,
        uphoneno:rows[0].uphoneno,
        ulanguage:rows[0].ulanguage,
        uinterest:rows[0].uinterest,
        umessage:rows[0].umessage
    })

            }
            })
        })

    //Edit User Post Action
    router.post('/update/:uid',function(req,res,next)
    {
      req.assert('uname','Name is Required').notEmpty()
      req.assert('uemail','A valid Email is required').isEmail()
      req.assert('uphoneno','Numbers only required').isNumeric() //validate PhoneNo
      var errors=req.validationErrors()
      if(!errors)  
      {
  var user={
    uname:req.sanitize('uname').escape().trim(),
    uemail:req.sanitize('uemail').escape().trim(),
    ugender:req.body.ugender,
    uphoneno:req.sanitize('uphoneno').escape(),
    ulanguage:req.sanitize('ulanguage').escape(),
    uinterest:req.sanitize('uinterest').escape(),
    umessage:req.body.umessage
  }      
  connection.query('update userdetails set ? where uid='+req.params.uid,user,function(err,result){
    if(err)
    {
     req.flash('error',err)   
   
    //render to views/users/add.ejs
    res.render('users/edit',{
        title:'Edit User',
        uid:req.params.uid,
        uname:req.body.uname,
        uemail:req.body.uemail,
        ugender:req.body.ugender,
        uphoneno:req.body.uphoneno,
        ulanguage:req.body.ulanguage,
        uinterest:req.body.uinterest,
        umessage:req.body.umessage
        })
    }
else{
  req.flash('success','Data Updated!') 
  res.redirect('/users') 
}
  })
      }
   else{
    //Display Error to User
    var error_msg=''
    errors.forEach(function(error){
      error_msg+=error.msg+"<br>"  
    })
    req.flash('error',error_msg)
    res.render('users/edit',{
    title:'Edit User',
    uid:req.params.uid,
        uname:req.body.uname,
        uemail:req.body.uemail,
        ugender:req.body.ugender,
        uphoneno:req.body.uphoneno,
        ulanguage:req.body.ulanguage,
        uinterest:req.body.uinterest,
        umessage:req.body.umessage
})
}
})

//Delete User
router.get('/delete/(:uid)',function(req,res,next){
    var user={uid:req.params.uid}
    connection.query('delete from userdetails where uid='+req.params.uid,user,function(err,result){
  if(err)      
  {
    req.flash('error',err)
    // Redirect to userslist page
    res.redirect('/users')
  }
  else{
    req.flash('success','users deleted uid='+req.params.uid)
    res.redirect('/users')
  }

    })
})
module.exports=router;

