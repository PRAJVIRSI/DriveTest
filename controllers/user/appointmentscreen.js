const path = require("path");
const bcrypt = require('bcrypt');
const User = require("../../models/User");
const Appointment = require("../../models/Appointment");

const appointmentPage = (req, res) => {
    res.render('appointment');
}

module.exports=appointmentPage;