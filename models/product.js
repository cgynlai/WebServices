const db = require('./databaseConfig');

var productDB = {
    //get all product list
    // won't show discounted_price column
    getProduct: function (callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log('product db connected!! ');
                var sql = 'SELECT product_id, product_name, product_description,price,quantity,category,cat_id,image_url,dateinserted FROM product_listing';
                conn.query(sql, function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        return callback(null, result)
                    }
                })
            }
        })
    },


    // get search product by substring, order by price asc
    getSearchproduct: function (searchstring, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log('db connected!! ');
                var sql = 'SELECT * FROM product_listing WHERE product_description like ? or category=? ORDER by price ASC';
                conn.query(sql, ['%' + searchstring + '%', searchstring], function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        return callback(null, result)
                    }
                })
            }
        })
    },

    // Advanced feature 3. Promotional facility to support discounts during promotional periods
    // Two query applied. First query, update discounted_price column by multiplying 80% price coulum.
    // Second query, show all info of updated product_listing. (Normal all product_listing won't show discounted_price column.)  
    getDiscountedProduct: function (callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log('product db connected!! ');

                //update discounted price
                var sql1 = 'UPDATE product_listing set discounted_price=price*0.8';
                conn.query(sql1, function (err, result) {
                    //conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {

                        console.log("show discounted price!!!");
                        var sql = 'SELECT * FROM product_listing';
                        conn.query(sql, function (err, result) {
                            conn.end();
                            if (err) {
                                console.log(err);
                                return callback(err, null);
                            } else {
                                return callback(null, result)
                            }
                        })
                    }



                })

            }
        })
    },

    insertProduct: function (product_name, price, cat_id, image_url, quantity, product_description, callback) {

        var dbConn = db.getConnection();
        dbConn.connect(function (err) {

            if (err) {//connecting to d/b encounter some error
                return callback(err, null);
            } else {

                var sql = `insert into product_listing(product_name,price,cat_id,image_url,quantity,product_description) 
                            Values(?,?,?,?,?,?)`;

                dbConn.query(sql, [product_name, price, cat_id, image_url, quantity, product_description], function (err, result) {

                    dbConn.end();
                    if (err) {
                        console.log(err);

                    }

                    return callback(err, result);

                });
            }

        });
    },

    // update product and before that log original product detail to anothe table
    updateProduct: function (product_name, price, cat_id, image_url, quantity, product_description, id, callback) {

        var dbConn = db.getConnection();
        dbConn.connect(function (err) {

            if (err) {
                return callback(err, null);
            } else {
                // Advanced feature 1. Logging of product record before updating
                var sql = 'SELECT * FROM product_listing where product_id=?';
                dbConn.query(sql, [id], function (err, result) {
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    }
                    else {
                        console.log('result is' + result);
                        console.log(result[0].product_name);
                        var origProductname = result[0].product_name;
                        var origProdes = result[0].product_description;
                        var origPrice = result[0].price;
                        var origDisprice = result[0].discounted_price;
                        var origQuantity = result[0].quantity;
                        var origCategory = result[0].category;
                        var origImag = result[0].image_url;
                        var origCat = result[0].cat_id;
                        var origDate = result[0].dateinserted;
                        var sqllog1 = 'CREATE TABLE IF NOT EXISTS productLog1 (product_id INT NOT NULL, product_name VARCHAR(45), product_description VARCHAR(255),price DECIMAL(4,2),discounted_price DECIMAL(5,2), quantity INT, category VARCHAR(100),cat_id INT, image_url VARCHAR(45), dateinserted TIMESTAMP)'
                        dbConn.query(sqllog1, function (err, result) {
                            // conn.end();
                            if (err) {
                                console.log(err);
                                return callback(err, null);
                            } else {
                                var sqllog2 = 'insert into productlog1 (product_id, product_name, product_description,price, discounted_price, quantity,category,cat_id, image_url, dateinserted) values (?,?,?,?,?,?,?,?,?,?)'
                                dbConn.query(sqllog2, [id,origProductname, origProdes,origPrice, origDisprice,origQuantity, origCategory,origCat, origImag,origDate], function (err, result) {
                                    // conn.end();
                                    if (err) {
                                        console.log(err);
                                        console.log("error here");
                                        return callback(err, null);
                                    } else {
                                        console.log('insert successful');
                                        // actual updating product starts here
                                        var sql = `update product_listing set product_name=?,price=?,cat_id=?,image_url=?,quantity=?,product_description=? where product_id=?`;
                                        dbConn.query(sql, [product_name, price, cat_id, image_url, quantity, product_description, id], function (err, result) {
                                            dbConn.end();
                                            if (err) {
                                                console.log(err)
                                            }
                                            return callback(err, result);
                                        })

                                    }
                                })
                            }
                        })
                    }
                })
            }

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

module.exports = productDB;