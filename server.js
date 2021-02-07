var app = require('./controller/app');

var port=8081;
var hostname="localhost";

var server = app.listen(port, function(){
    console.log(`server started, listening port : ${port} ...`);
})