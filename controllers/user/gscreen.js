const path = require("path");
const bcrypt = require('bcrypt');
const User = require("../../models/User");
const Appointment = require("../../models/Appointment");

const gPage = async (req, res) => {
    const user = await User.findById(req.session.userId).populate('appointmentIdG');
    if (user?.licenseNo) {
        res.render('g', {user});
    } else if (user) {
        res.render('g2', {user});
    } else {
        res.render('login');
    }
}

module.exports=gPage;