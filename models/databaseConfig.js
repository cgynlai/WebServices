var mysql = require('mysql');

var dbconnect = {
    getConnection : function () {
        var conn = mysql.createConnection({
           // host: "localhost",
           host: "localhost",
            user: "root",
            password: "1234",
            database: "grocery_assignment1"
        });
        return conn;
    }
}

module.exports = dbconnect;