const path = require("path");
const bcrypt = require('bcrypt');
const User = require("../../models/User");
const Appointment = require("../../models/Appointment");


const existUserName = (req, res) => {
    User.findOne({userName: req.query.name}, (error, user) => {
        res.json({exist: !!user});
    });
}

module.exports=existUserName;