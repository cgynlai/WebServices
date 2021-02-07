const db = require('./databaseConfig');

var catDB = {
    //get all category list
    getCategory : function(callback){
        var dbConn = db.getConnection();
        dbConn.connect( function(err){
            if (err) {
                console.log(err);
                return callback(err,null);
            }
            else {
                console.log('category db connected!! ');
                var sql = 'SELECT * FROM category';
                dbConn.query(sql, function(err,result){
                    dbConn.end();
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

    // insert new category
    insertCat: function (category_name, description, callback) {

        var dbConn = db.getConnection();
        dbConn.connect(function (err) {

            if (err) {
                console.log("db connection error");
                return callback(err, null);
            } else {

                    var sql = `insert into category(category_name, description) Values(?,?)`;

                    dbConn.query(sql, [category_name, description], function (err, result) {

                        dbConn.end();
                        if (err) {
                            console.log(err);

                        }

                        return callback(null, result);

                    });
            }

        });
    },
    
    // update category
    updateCat: function (category_name, description, id, callback) {

        var dbConn = db.getConnection();
        dbConn.connect(function (err) {

            if (err) {
                return callback(err, null);
             } else {
                      var sql = `update category set category_name=?,description=? where id=?`;
                      dbConn.query(sql, [category_name, description,id], function(err, result){
                          dbConn.end();
                          if (err){
                              console.log(err)
                          }
                          return callback(err,result);
                      })
             }
            });
        },

    // delete category
    deleteCat: function (id, callback) {

        var dbConn = db.getConnection();
        dbConn.connect(function (err) {

            if (err) {
                return callback(err, null);
            } else {

                var sql = `delete from category where id=?`;

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

module.exports=catDB;