var mysql = require('mysql');

var dbconnect = {
    getConnection : function () {
        var conn = mysql.createConnection({
           // host: "localhost",
           host: "myowndatabase1.cqqczc8tt7jg.us-east-1.rds.amazonaws.com",
            user: "root",
            password: "12341234",
            database: "grocery1"
        });
        return conn;
    }
}

module.exports = dbconnect;