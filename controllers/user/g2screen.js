const path = require("path");
const bcrypt = require('bcrypt');
const User = require("../../models/User");
const Appointment = require("../../models/Appointment");


const g2Page = async (req, res) => {
    const user = await User.findById(req.session.userId).populate('appointmentId');
    res.render('g2', {user});
}

module.exports=g2Page;