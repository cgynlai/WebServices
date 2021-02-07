const db = require('./databaseConfig');

var productDB = {
    //get all product list
    // won't show discounted_price column
    getProduct : function(callback){
        var conn = db.getConnection();
        conn.connect( function(err){
            if (err) {
                console.log(err);
                return callback(err,null);
            }
            else {
                console.log('product db connected!! ');
                var sql = 'SELECT product_id, product_name, product_description,price,quantity,cat_id,image_url,dateinserted FROM product_listing';
                conn.query(sql, function(err,result){
                    conn.end();
                    if (err){
                        console.log(err);
                        return callback(err,null);
                    } else {
                        return callback(null,result)
                    }
                })
            }
        })
    },


    // get search product by substring, order by price asc
    getSearchproduct : function(searchstring, callback){
        var conn = db.getConnection();
        conn.connect( function(err){
            if (err) {
                console.log(err);
                return callback(err,null);
            }
            else {
                console.log('db connected!! ');
                var sql = 'SELECT * FROM product_listing WHERE product_description like ? ORDER by price ASC';
                conn.query(sql, ['%'+searchstring+'%'], function(err,result){
                    conn.end();
                    if (err){
                        console.log(err);
                        return callback(err,null);
                    } else {
                        return callback(null,result)
                    }
                })
            }
        })
    },

// Advanced feature 3. Promotional facility to support discounts during promotional periods
// Two query applied. First query, update discounted_price column by multiplying 80% price coulum.
// Second query, show all info of updated product_listing. (Normal all product_listing won't show discounted_price column.)  
getDiscountedProduct : function(callback){
        var conn = db.getConnection();
        conn.connect( function(err){
            if (err) {
                console.log(err);
                return callback(err,null);
            }
            else {
                console.log('product db connected!! ');

                //update discounted price
                var sql1 = 'UPDATE product_listing set discounted_price=price*0.8';
                conn.query(sql1, function(err,result){
                   //conn.end();
                    if (err){
                        console.log(err);
                        return callback(err,null);
                    } else {

                        console.log("show discounted price!!!");
                var sql = 'SELECT * FROM product_listing';
                conn.query(sql, function(err,result){
                    conn.end();
                    if (err){
                        console.log(err);
                        return callback(err,null);
                    } else {
                        return callback(null,result)
                    }
                })
                    }


                    
                })
                
            }
        })
    },

    insertProduct: function (product_name,price,cat_id,image_url,quantity,product_description,callback) {

        var dbConn = db.getConnection();
        dbConn.connect(function (err) {

            if (err) {//connecting to d/b encounter some error
                return callback(err, null);
            } else {

                var sql = `insert into product_listing(product_name,price,cat_id,image_url,quantity,product_description) 
                            Values(?,?,?,?,?,?)`;
                
                dbConn.query(sql,[product_name,price,cat_id,image_url,quantity,product_description],function(err,result){

                    dbConn.end();
                    if (err) {
                        console.log(err);

                    }

                    return callback(err, result);

                });
            }

        });
    },

    // update product
    updateProduct: function (product_name,price,cat_id,image_url,quantity,product_description,id,callback) {

        var dbConn = db.getConnection();
        dbConn.connect(function (err) {

            if (err) {
                return callback(err, null);
             } else {
                      // Advanced feature 1. Logging of product record before updating
                      var sql = 'SELECT * FROM product_listing where product_id=?';
                      dbConn.query(sql, [id], function(err,result){
                          if (err) {
                            console.log(err);
                            return callback(err,null);
                          }
                        else{
                      var logData = JSON.stringify(result); // logData for future use
                      console.log(`{"Logged Data" : ${logData}}`);
                      console.log("old data logged.");
             }
            })
        }

            // actual updating product starts here
             var sql = `update product_listing set product_name=?,price=?,cat_id=?,image_url=?,quantity=?,product_description=? where product_id=?`;
             dbConn.query(sql, [product_name,price,cat_id,image_url,quantity,product_description,id], function(err, result){
                 dbConn.end();
                 if (err){
                     console.log(err)
                 }
                 return callback(err,result);
             })
            });
        },
    
        // delete product
    deleteProduct: function (id, callback) {

        var dbConn = db.getConnection();
        dbConn.connect(function (err) {

            if (err) {
                return callback(err, null);
            } else {

                var sql = `delete from product_listing where product_id=?`;

                dbConn.query(sql, [id], function (err, result) {

                    dbConn.end();
                    if (err) {
                        console.log(err);

                    }

                    return callback(err, result);

                });
            }

        });
    },
}

module.exports=productDB;