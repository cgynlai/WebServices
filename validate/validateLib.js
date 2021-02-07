const validator = require('validator');

var validateLib={

    validateUserId:function(req,res,next){

        var userid=req.params.userid;

        var pattern=new RegExp(`^[1-9][0-9]*$`);

        if(pattern.test(userid)){

            next();
        }else{

            res.status(500);
            res.send(`{"Message":"Invalid ID Input Data"}`);
        }

    },

    validateId:function(req,res,next){

        var id=req.params.id;

        var pattern=new RegExp(`^[1-9][0-9]*$`);

        if(pattern.test(id)){

            next();
        }else{

            res.status(500);
            res.send(`{"Message":"Invalid ID Input Data"}`);
        }

    },
    
    validateUserRegistration:function(req,res,next){

        var username=req.body.username;
        var email=req.body.email;
        var role=req.body.role;
        var password=req.body.password;

        var patternName=new RegExp(`^[a-zA-Z0-9 ]+$`);


        if(/*validator.isAlphanumeric(username)*/ patternName.test(username) && validator.isEmail(email)
        && (role=="admin" || role=="member") && validator.isAlphanumeric(password) && password.length>=5){

            next();
        }else{

            res.status(500);
            res.send(`{"Message":"Invalid Input Data"}`);
        }

    }


}
module.exports=validateLib;
