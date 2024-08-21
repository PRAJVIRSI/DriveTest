const path = require("path");
const bcrypt = require('bcrypt');
const User = require("../../models/User");
const Appointment = require("../../models/Appointment");





const driverPage = (req, res) => {
    res.render('dashboard');
}

module.exports=driverPage;