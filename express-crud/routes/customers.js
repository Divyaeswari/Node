//Create crud//(file created inside routes folder)
var express=require('express');
var router=express.Router();
var connection=require('../lib/dbconfig');
//Get Home Page

router.get('/',function(req,res,next){
    connection.query('select * from customers order by id desc',function(err,rows){
        if(err){
            req.flash('error',err);
            res.render('customers',{page_title:"Customers-Node.js",data:''});
        }
        else{
            res.render('customers',{page_title:"Customers.Node.js",data:rows});
        }
    });
});

//show add user form

router.get('/add',function(req,res,next){
    //render to views/users/add.ejs
    res.render('customers/add',{
        title:'Add New Customers',
        name:'',
        email:''
    })
})

//Add new user post action

router.post('/add',function(req,res,next){
    req.assert('name','Name is required').notEmpty() //validate name
    req.assert('email','A valid email is required').isEmail() //validate email
    var errors =  req.validationErrors()
    if(!errors){
        var user={
            name:req.sanitize('name').escape().trim(),
            email:req.sanitize('email').escape().trim()
        }
        connection.query('insert into customers SET?',user,function(err,result){
            if(err){
                req.flash('error',err)
                //render to views/users/add.ejs
                res.render('customers/add',{
                    title:'Add New Customer',
                    name:user.name,
                    email:user.email
                })
            }
            else{
                req.flash('success','Data Added Successfully');
                res.redirect('/customers')
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
                res.render('customers/add',{
                    title:"Add New Customer",
                    name:req.body.name,
                    email:req.body.email
                })
            }
})


//show edit user form
router.get('/edit/(:id)',function(req,res,next){
            connection.query('select * from customers where id='+req.params.id,function(err,rows,fields){
                if(err)
                {
                    throw err;
                }
            //If users not found
            if(rows.length<=0)
            {
                req.flash('error','Customers Not found with Id='+req.param.id)
                res.redirect('/customers')

            }
            else{ // User found
                //render to views/customers/edit.ejs
    res.render('customers/edit',{
        title:'Edit Customer',
        id:rows[0].id,
        name:rows[0].name,
        email:rows[0].email
    })

            }
            })
        })

    //Edit User Post Action
    router.post('/update/:id',function(req,res,next)
    {
      req.assert('name','Name is Required').notEmpty()
      req.assert('email','A valid Email is required').isEmail()
      var errors=req.validationErrors()
      if(!errors)  
      {
  var user={
    name:req.sanitize('name').escape().trim(),
    email:req.sanitize('email').escape().trim()
  }      
  connection.query('update customers set ? where id='+req.params.id,user,function(err,result){
    if(err)
    {
     req.flash('error',err)   
   
    //render to views/customers/add.ejs
    res.render('customers/edit',{
        title:'Edit Customer',
        id:req.params.id,
        name:req.body.name,
        email:req.body.email
        })
    }
else{
  req.flash('success','Data Updated!') 
  res.redirect('/customers') 
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
    res.render('customers/edit',{
    title:'Edit customer',
    id:req.params.id,
    name:req.body.name,
    emai:req.body.email
})
}
})

//Delete User
router.get('/delete/(:id)',function(req,res,next){
    var user={id:req.params.id}
    connection.query('delete from customers where id='+req.params.id,user,function(err,result){
  if(err)      
  {
    req.flash('error',err)
    // Redirect to customerlist page
    res.redirect('/customers')
  }
  else{
    req.flash('success','customer deleted id='+req.params.id)
    res.redirect('/customers')
  }

    })
})
module.exports=router;
