const Appointment = require("../models/Appointment");

const findTimeslot = (req, res) => {
    Appointment.find({date: req.query.date}, (error, slots) => {
        let s = slots.map(s => s.time);
        res.json({slots: s});
    })
}

const saveTimeslots = (req, res) => {
    const adate = req.body.appointmentDate;
    let ss = req.body.selectedSlots;
    const vos = ss.substring(0, ss.length - 1)
        .split(',')
        .map(v => {
            return {
                date: adate,
                time: v,
                isTimeSlotAvailable: true
            }
        });
    Appointment.create(vos, error => {
        if (error == null) {
            res.render('appointment', {code: 200});
        } else {
            res.render('appointment', {code: 500, message: error});
        }
    });
}


module.exports = {
    findTimeslot, saveTimeslots
}