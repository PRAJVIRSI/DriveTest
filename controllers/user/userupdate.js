const path = require("path");
const bcrypt = require('bcrypt');
const User = require("../../models/User");
const Appointment = require("../../models/Appointment");


const updateUser = (req, res) => {
    const inputData=buildUser(req);
    if (req.body.selectedSlotId) {
        inputData.testType = 'G';
        inputData.appointmentId = req.body.selectedSlotId;
    }
    if (req.body.selectedSlotIdG) {
        inputData.testType = 'G';
        inputData.appointmentIdG = req.body.selectedSlotIdG;
    }
    User.findByIdAndUpdate(req.session.userId, inputData, async (error, user) => {
        if (error == null) {
            if (req.body.ssid) {
                await Appointment.findByIdAndUpdate(req.body.ssid, {isTimeSlotAvailable: true});
            }
            if (req.body.selectedSlotId) {
                await Appointment.findByIdAndUpdate(req.body.selectedSlotId, {isTimeSlotAvailable: false});
            }
            if (req.body.ssidg) {
                await Appointment.findByIdAndUpdate(req.body.ssidg, {isTimeSlotAvailable: true});
            }
            if (req.body.selectedSlotIdG) {
                await Appointment.findByIdAndUpdate(req.body.selectedSlotIdG, {isTimeSlotAvailable: false});
            }
            res.render(req.body.path, {code: 200});
        } else {
            res.render(req.body.path, {code: 500, message: error});
        }
    });
}



function buildUser(req) {
    let user = {
        ...req.body,
    };
    for (let key in user) {
        user['address.' + key] = user[key];
        user['carInfo.' + key] = user[key];
    }

    return user;
}

module.exports=updateUser;