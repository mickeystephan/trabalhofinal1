const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt'); 
const query = require('../database/query'); 

passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
           
            const user = await query('SELECT * FROM users WHERE username = $1', [username]);
            if (!user.rows.length) return done(null, false);

            const isMatch = await bcrypt.compare(password, user.rows[0].password);
            return isMatch ? done(null, user.rows[0]) : done(null, false);
        } catch (err) {
            return done(err);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        
        const user = await query('SELECT * FROM users WHERE id = $1', [id]);
        done(null, user.rows[0]);
    } catch (error) {
        done(error);
    }
});

module.exports = passport;

exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'Unauthorized' });
};

exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    res.status(403).json({ message: 'Forbidden' });
};
