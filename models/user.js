var db = require('./databaseConfig');
var config= require('../config');
var jwt=require('jsonwebtoken');
var bcrypt = require('bcryptjs');

var userDB = {
    // get user with id
    getUser : function(userid, callback){
        var conn = db.getConnection();
        conn.connect( function(err){
            if (err) {
                console.log(err);
                return callback(err,null);
            }
            else {
                console.log('db connected!! ');
                var sql = 'SELECT * FROM user WHERE id = ?';
                conn.query(sql, [userid], function(err,result){
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
    //get all user
    getAlluser : function( callback) {
        var dbconn = db.getConnection();
        dbconn.connect( function(err){
            if (err) {
                console.log(err);
                return callback(err,null);
            }
            else {
                console.log('db connected!! ');
                var sql = 'SELECT * FROM user';
                dbconn.query(sql, function(err,result){
                    dbconn.end();
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

    
    insertUser: function (username, email, role, password, callback) {

        var dbConn = db.getConnection();
        dbConn.connect(function (err) {

            if (err) {//connecting to d/b encounter some error
                return callback(err, null);
            } else {


                bcrypt.hash(password, 10, function (err, hash) {

                    password = hash;
                    if (err) {
                        return callback(err, null);
                    }

                    var sql = `insert into user(username,email,role,password) 
                Values(?,?,?,?)`;

                    dbConn.query(sql, [username, email, role, password], function (err, result) {

                        dbConn.end();
                        if (err) {
                            console.log(err);

                        }

                        return callback(err, result);

                    });
                })


            }

        });
    },

    updateUser: function (email, password, userid, callback) {

        var dbConn = db.getConnection();
        dbConn.connect(function (err) {

            if (err) {//connecting to d/b encounter some error
                return callback(err, null);
             } else {
                 
                  bcrypt.hash(password, 10, function(err, hash){
                      password=hash;
                      if(err){
                          return callback(err,null);
                      }
                      var sql = `update user set email=?,password=? where id=?`;
                      dbConn.query(sql, [email,password,userid], function(err, result){
                          dbConn.end();
                          if (err){
                              console.log(err)
                          }
                          return callback(null,result);
                      })
                  });

             }
             //{

            //     var sql = `update user set email=?,password=? 
            //                 where id=?`;

            //     dbConn.query(sql, [email, password, userid], function (err, result) {

            //         dbConn.end();
            //         if (err) {
            //             console.log(err);

            //         }

            //         return callback(err, result);

            //     });
            // }

        });
    },

    deleteUser: function (userid, callback) {

        var dbConn = db.getConnection();
        dbConn.connect(function (err) {

            if (err) {//connecting to d/b encounter some error
                return callback(err, null);
            } else {

                var sql = `delete from user 
                            where userid=?`;

                dbConn.query(sql, [userid], function (err, result) {

                    dbConn.end();
                    if (err) {
                        console.log(err);

                    }

                    return callback(err, result);

                });
            }

        });
    },

    // check user password and email
    loginUser : function (email, password, callback){
        var conn=db.getConnection();
        conn.connect( function(err){
            if(err){
                console.log(err);
                return callback(err,null);
            } else {
                console.log('db connected!!');
                var sql = 'select * from user where email=?';
                conn.query(sql, [email], function(err,result){
                    conn.end();
                    if (err){
                        console.log(err);
                        return callback(err,null);
                    } else {
                       
                        if(result.length==1){
                           // compare hashed password
                          var hashPwd = result[0].password; 
                          console.log(hashPwd); 
                          bcrypt.compare(password,hashPwd, function(err,success){
                              if (err|| !success){
                                  return callback(err,null);
                              } else {
                                var token = jwt.sign({username:result[0].username, role:result[0].role},config.key,{expiresIn:86400});
                           return callback(null,token);
                              }
                          })
                           
                        }else {
                        return callback(null,null);
                    }
                }
            })
            }
        })
    }

    }


module.exports=userDB;