

const express = require('express');
const bodyParser = require('body-parser');
const userDB = require('../models/user');
const productDB = require('../models/product');
const catDB=require('../models/category');
const authLib= require('../auth/verifyToken');
const validator= require('../validate/validateLib');
const cors=require('cors');

var app = express();

app.options('*',cors());

app.use(cors());


var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(urlencodedParser);
app.use(bodyParser.json());


//GET user with id
app.get('/user/:userid', validator.validateUserId,function (req, res) {
    var userid = req.params.userid;
    userDB.getUser(userid, function (err, result) {
        if (!err) {
            res.send(result);
        } else {
            res.status(500).send("some error,unable to get user info!")
        }
    })
});




//GET all user
app.get('/all_user', authLib.verifyToken, authLib.verifyAdmin,function (req, res) {
    userDB.getAlluser(function (err, result) {
        if (err) {
            res.status(500).send("error, unable to get all user info!!");
        } else {
            res.type('json');
            res.send(JSON.stringify(result));
        }
    })
})

//POST insert user
app.post('/adduser', validator.validateUserRegistration,function(req,res){
        var username=req.body.username;
        var email=req.body.email;
        var role=req.body.role;
        var password=req.body.password;
        userDB.insertUser(username, email, role, password, function(err, result){
            if (err) {
                res.status(500);
                res.send(`{"message":"${err}"}`);
    
            } else {
                res.status(201);
                res.send(`{"InsertID":${result.insertId}}`);
            }
        }); 
})

//PUT update user
app.put('/user/:userid',validator.validateUserId,function(req,res){

    var userid=req.params.userid;
     var email=req.body.email;
     var password=req.body.password;
 
     userDB.updateUser(email,password,userid,function(err,result){
 
         if (err) {
             res.status(500);
             res.send(`{"message":"${err}"}`);
 
         } else {
             res.status(200);
             //res.send(result);
             res.send(`{"Affected Rows":${result.affectedRows}}`);
         }
 
     });
 
 });

//POST login
app.post('/login', function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    userDB.loginUser(email, password, function (err, result) {
        if (err) {
            res.status(201).send(`{"message" : "Error!"}`);
        } else {
            if (result == null) {
                res.status(200).send(`{"message": "login failed"}`);
            } else {
                res.status(200).send(`{"JWT": "${result}}"`);
            }
        }
    })
})

// category webservices //

//GET all category
app.get('/all_category', function(req,res){
    catDB.getCategory(function(err,result){
        if (err) {
            res.status(500).send("Error : unable to get Category list!!");
        } else {
            res.send(`{"Categories" : "${JSON.stringify(result)}"}`);
        }
    })

});

//POST insert new category
app.post('/add_category',authLib.verifyToken, authLib.verifyAdmin, function(req,res){
    var category_name = req.body.category_name;
    var description = req.body.description;
    catDB.insertCat(category_name,description, function(err, result){
        if (err) {
            res.status(500);
            res.send(`{"message":"${err}"}`);

        } else {
            res.status(201);
            res.send(`{"InsertID":${result.insertId}}`);
        }
    })
});


//PUT update category
app.put('/category/:id',validator.validateId, authLib.verifyToken, authLib.verifyAdmin, function(req,res){

    var id=req.params.id;
     var category=req.body.category_name;
     var description=req.body.description;
 
     catDB.updateCat(category,description,id,function(err,result){
 
         if (err) {
             res.status(500);
             res.send(`{"message":"${err}"}`);
 
         } else {
             res.status(200);
             //res.send(result);
             console.log("!!!");
             res.send(`{"Affected Rows":${result.affectedRows}}`);
         }
 
     });
 
 });

//DELETE category
app.delete('/category/:id',validator.validateId, authLib.verifyToken,authLib.verifyAdmin ,function(req,res){
    var id=req.params.id;
   

    catDB.deleteCat(id,function(err,result){

        if (err) {
            res.status(500);
            res.send(`{"message":"${err}"}`);

        } else {
            res.status(200);
            //res.send(result);
            res.send(`{"Affected Rows":${result.affectedRows}}`);
        }

    });


});






// Product webservices

//GET all product
app.get('/all_product', function(req,res){
    productDB.getProduct(function(err,result){
        if (err) {
            res.status(500);
            res.send(`{"message" : "${err}"}`);
        } else {
            res.send(`{"Products" : "${JSON.stringify(result)}"}`);
        }
    })

});

//POST insert new product
app.post('/add_product',authLib.verifyToken, authLib.verifyAdmin, function(req,res){
    var product_name = req.body.product_name;
    var price = req.body.price;
    var cat_id = req.body.cat_id;
    var image_url = req.body.image_url;
    var quantity = req.body.quantity;
   // var discounted_price = req.body.discounted_price;
    var product_description = req.body.product_description;

    productDB.insertProduct(product_name, price, cat_id, image_url, quantity, product_description, function (err, result) {
        if (err) {
            res.status(500);
            res.send(`{"message":"${err}"}`);

        } else {
            res.status(201);
            res.send(`{"InsertID":${result.insertId}}`);
        }
    });    
});


//PUT update product
app.put('/product/:id',validator.validateId, authLib.verifyToken, authLib.verifyAdmin, function(req,res){

    var id=req.params.id;
    var product_name = req.body.product_name;
    var price = req.body.price;
    var cat_id = req.body.cat_id;
    var image_url = req.body.image_url;
    var quantity = req.body.quantity;
    //var discounted_price = req.body.discounted_price;
    var product_description = req.body.product_description;
 
     productDB.updateProduct(product_name,price,cat_id,image_url,quantity,product_description,id,function(err,result){
 
         if (err) {
             res.status(500);
             res.send(`{"message":"${err}"}`);
 
         } else {
             res.status(200);
             //res.send(result);
             res.send(`{"Affected Rows":${result.affectedRows}}`);
         }
     });
 });

 //DELETE product
app.delete('/product/:id',validator.validateId, authLib.verifyToken,authLib.verifyAdmin ,function(req,res){
    var id=req.params.id;
    productDB.deleteProduct(id,function(err,result){

        if (err) {
            res.status(500);
            res.send(`{"message":"${err}"}`);

        } else {
            res.status(200);
            //res.send(result);
            res.send(`{"Affected Rows":${result.affectedRows}}`);
        }
    });
});



// search product 
app.get('/product/:searchstring', function (req, res) {
    var id = req.params.searchstring;
    productDB.getSearchproduct(id, function (err, result) {
        if (err) {
            res.status(500).send(`{'Message': 'error, unable to search!'}`);
        } else {
        //console.log(result);
           res.type('json');
           res.send(`{"Search Result":"${JSON.stringify(result)}"}`);
            
        }
    })
});

//Get product list with promo price
//
// Advanced feature 3. Promotional facility to support discounts during promotional periods
// Two query applied. First query, update discounted_price column by multiplying 80% price coulum.
// Second query, show all info of updated product_listing. (Normal all product_listing won't show discounted_price column.)
app.get('/promo20discount', function (req, res) {
    productDB.getDiscountedProduct(function (err, result) {
        if (err) {
            res.status(500).send("Error : unable to get all product info!!");
        } else {
            res.type('json');
            res.send(`{"Products" : "${JSON.stringify(result)}"}`);
        }
    })
})


module.exports = app;