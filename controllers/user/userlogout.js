const path = require("path");
const bcrypt = require('bcrypt');
const User = require("../../models/User");
const Appointment = require("../../models/Appointment");


const logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    })
}


module.exports=logout;