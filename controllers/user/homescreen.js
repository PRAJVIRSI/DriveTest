const path = require("path");
const bcrypt = require('bcrypt');
const User = require("../../models/User");
const Appointment = require("../../models/Appointment");


const indexPage = (req, res) => {
    res.render('index');
}

module.exports = indexPage;