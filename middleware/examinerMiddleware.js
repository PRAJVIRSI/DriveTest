const User = require('../models/User')
module.exports = (req, res, next) => {
    User.findById(req.session.userId, (error, user) => {
        if (error || !user || user.userType !== 'examiner') return res.redirect('/');
        next();
    })
}
