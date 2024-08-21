const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const expressSession = require('express-session');
const flash = require('connect-flash');
const moment = require('moment');


mongoose.connect('mongodb+srv://purohitrajvirsinh5:MongoDB%40123@cluster0.vlzakfn.mongodb.net/GroupProject?retryWrites=true&w=majority', { useNewUrlParser: true });
// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://test:test@cluster0.expqayk.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
// //   client.close();
// });

global.loggedIn = null;
global.userType = null;
const app = new express();
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload());
app.use(expressSession({
    secret: 'This is a secret',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());
app.use('*', (req, res, next) => {
    global.loggedIn = req.session.userId;
    global.userType = req.session.userType;
    next();
});
app.set('view engine', 'ejs');
app.listen(4800, () => {
    console.log('App listening on port 4800')
});

//Middleware
const authMiddleware = require('./middleware/authMiddleware');
const adminMiddleware = require('./middleware/adminMiddleware');
const examinerMiddleware = require('./middleware/examinerMiddleware');
const hasLoggedMiddleware = require('./middleware/hasLoggedMiddleware');

//User Controllers
const renderHomePage = require("./controllers/user/homescreen");
const pageLogin=require("./controllers/user/loginscreen");
const signin = require("./controllers/user/signin");
const pageDriver=require("./controllers/user/driverscreen")
const pageG=require("./controllers/user/gscreen")
const pageG2=require("./controllers/user/g2screen")
const pageAppointment=require("./controllers/user/appointmentscreen")
const pageExaminer=require("./controllers/user/examinerscreen")
const userSignup=require("./controllers/user/usersignup")
const existUser=require("./controllers/user/userexists")
const userLogin=require("./controllers/user/userlogin")
const userLogout=require("./controllers/user/userlogout")
const userUpdate=require("./controllers/user/userupdate")
const slotAvailability=require("./controllers/user/slotavailability")

//examiner controllers
const examinerComment=require("./controllers/examiner/examinercomment")
const userLoad=require("./controllers/examiner/userload")

//admin/controllers
const findappointmentAvailability=require("./controllers/admin/findappointmentavailability")
const appointmentslotSave=require("./controllers/admin/appointmentslotsave")

app.get('/', renderHomePage);
app.get('/login', hasLoggedMiddleware, pageLogin);
app.get('/signin',hasLoggedMiddleware,signin)
app.get('/driver', pageDriver);
app.get('/users/update',userUpdate);
app.get('/g', authMiddleware, pageG);
app.get('/g2', authMiddleware, pageG2);
app.get('/appointment', adminMiddleware, pageAppointment);
app.get('/examiner', examinerMiddleware, pageExaminer);

app.get('/users/signup/preCheck', existUser);
app.post('/users/signin', hasLoggedMiddleware, userSignup);
app.post('/users/login', hasLoggedMiddleware, userLogin);
app.get('/users/logout', userLogout);
app.post('/users/update', authMiddleware, userUpdate);
app.get('/users/timeslot', authMiddleware, slotAvailability);

app.get('/admin/timeslot', adminMiddleware, findappointmentAvailability);
app.post('/admin/timeslot/save', adminMiddleware, appointmentslotSave);

app.get('/examiner/userList', examinerMiddleware, userLoad);
app.post('/examiner/comment', examinerMiddleware, examinerComment);
