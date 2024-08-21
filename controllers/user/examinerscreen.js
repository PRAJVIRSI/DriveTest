const path = require("path");
const bcrypt = require('bcrypt');
const User = require("../../models/User");
const Appointment = require("../../models/Appointment");


const examinerPage = (req, res) => {
    res.render('examiner');
}


module.exports=examinerPage;