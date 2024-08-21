const path = require("path");
const bcrypt = require('bcrypt');
const User = require("../models/User");
const Appointment = require("../models/Appointment");

const indexPage = (req, res) => {
    res.render('index');
}

const loginPage = (req, res) => {
    let userName = ""
    let password = ""
    let loginUserName = ""
    let loginPassword = ""
    const data = req.flash('data')[0];
    if(typeof data != "undefined") {
        userName = data.userName;
        password = data.password;
        loginUserName = data.loginUserName;
        loginPassword = data.loginPassword;
    }

    res.render('login', {
        errors: req.flash('validationErrors'),
        username: userName,
        password: password,
        loginUserName: loginUserName,
        loginPassword: loginPassword
    });
}

const driverPage = (req, res) => {
    res.render('dashboard');
}

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

const g2Page = async (req, res) => {
    const user = await User.findById(req.session.userId).populate('appointmentId');
    res.render('g2', {user});
}

const appointmentPage = (req, res) => {
    res.render('appointment');
}

const examinerPage = (req, res) => {
    res.render('examiner');
}

const signup = (req, res) => {
    User.create({
        userName: req.body.userName,
        password: req.body.password,
        userType: req.body.userType
    }, (error, user) =>{
        if (error == null) {
            res.render('login', {code: 200,
                errors: [],
                username: '',
                password: '',
                loginUserName: '',
                loginPassword: ''});
        } else {
            const validationErrors = Object.keys(error.errors).map(key => error.errors[key].message);
            req.flash('validationErrors', validationErrors);
            req.flash('data',req.body);
            res.redirect('/login');
        }
    });
}

const existUserName = (req, res) => {
    User.findOne({userName: req.query.name}, (error, user) => {
        res.json({exist: !!user});
    });
}

const login = (req, res) => {
    const {loginUserName, loginPassword} = req.body;
    User.findOne({userName: loginUserName}, (error, user) => {
        if (user) {
            bcrypt.compare(loginPassword, user.password, (error, same) => {
                if (same) { // if passwords match
                    req.session.userId = user._id;
                    req.session.userType = user.userType;
                    if (user.userType === "admin") {
                        res.redirect('/appointment');
                    } else if(user.userType === "examiner") {
                        res.redirect('/examiner');
                    } else {
                        res.redirect('/driver');
                    }
                } else {
                    req.flash('validationErrors', ['Wrong user name or password']);
                    req.flash('data',req.body);
                    res.redirect('/login');
                }
            })
        } else {
            req.flash('validationErrors', ['User doesn\'t exist, please signup first']);
            req.flash('data',req.body);
            res.redirect('/login');
        }
    })
}

const logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    })
}

const updateUser = (req, res) => {
    const vo = buildUser(req);
    if (req.body.selectedSlotId) {
        vo.testType = 'G2';
        vo.appointmentId = req.body.selectedSlotId;
    }
    if (req.body.selectedSlotIdG) {
        vo.testType = 'G';
        vo.appointmentIdG = req.body.selectedSlotIdG;
    }
    User.findByIdAndUpdate(req.session.userId, vo, async (error, user) => {
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

const findAvailableTimeslot = (req, res) => {
    Appointment.find({date: req.query.date, isTimeSlotAvailable: true}, (error, slots) => {
        let s = slots.map(s => {
            return {
                id: s._id,
                time: s.time
            }
        });
        res.json({slots: s});
    })
}


function buildUser(req) {
    let picSrc = saveImgGetSrc(req);
    let user = {
        ...req.body,
    };
    for (let key in user) {
        user['address.' + key] = user[key];
        user['carInfo.' + key] = user[key];
    }

    return user;
}


// function saveImgGetSrc(req) {
//     let picSrc = {};
//     let files = req.files;
//     for (let key in files) {
//         let file = files[key];
//         picSrc[key] = '/assets/img/user/' + file.name;
//         file.mv(path.resolve(__dirname, '..', 'public/assets/img/user', file.name));
//     }
//     return picSrc;
// }

module.exports = {
    indexPage, loginPage, driverPage, gPage, g2Page, appointmentPage, examinerPage, signup, existUserName, login, logout, updateUser, findAvailableTimeslot
}