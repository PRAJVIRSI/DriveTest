const path = require("path");
const bcrypt = require('bcrypt');
const User = require("../../models/User");
const Appointment = require("../../models/Appointment");


const signup = (req, res) => {
    console.log(req.body)
    User.create({
        userName: req.body.userName,
        password: req.body.password,
        userType: req.body.userType
    }, (error, user) =>{
        console.log('user is: ', user)
        console.log('error is: ', error)
        if (error == null) {
            res.render('login', {code: 200,
                errors: [],
                username:'',
                password:'',
                loginUserName:'',
                loginPassword:''});
        } else {
            const validationErrors = Object.keys(error.errors).map(key => error.errors[key].message);
            req.flash('validationErrors', validationErrors);
            req.flash('data',req.body);
            res.redirect('/login');
        }
    });
}


module.exports=signup;