var express = require('express');
var dotenv = require('dotenv').config();
var passport = require('passport'),
	FacebookStrategy = require('passport-facebook').Strategy;

var app = express();

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new FacebookStrategy({
	clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
},
  
function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
}));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.get('/', function(req, res) { 
	res.sendFile('index.html', {root: __dirname});
});

app.get('/success', function(req, res) { 
	res.sendFile('success.html', {root: __dirname});
});

app.get('/auth/facebook', passport.authenticate('facebook', { authType: 'rerequest', scope: ['user_friends', 'manage_pages'] }));

app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), function(req, res) {
    res.redirect('/success');
});

app.get('/logout', function(req, res) {
	req.logout();
  	res.redirect('/');
});
	
app.listen('3000', function() {
	console.log("server is running on PORT 3000");
});