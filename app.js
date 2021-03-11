const express = require('express'),
	app = express(),
	BodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	User = require('./models/user'),
	passport = require('passport'),
	passlocal = require('passport-local'),
	passportLocalMongoose = require('passport-local-mongoose');

app.use(
	BodyParser.urlencoded({
		extended: true
	})
);
app.set('view engine', 'ejs');
app.use(passport.initialize());
app.use(passport.session());

app.use(
	require('express-session')({
		secret: 'code',
		resave: false,
		saveUninitialized: false
	})
);
passport.use(new passlocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect('mongodb://localhost/AuthDB', {
	useUnifiedTopology: true,
	useNewUrlParser: true
});
//================================================

app.get('/', function(req, res) {
	res.render('home');
});

app.get('/secret', function(req, res) {
	res.render('secret');
});
//=======================================

app.get('/register', function(req, res) {
	res.render('register');
});
app.post('/register', function(req, res) {
	User.register(
		new User({
			username: req.body.username
		}),
		req.body.password,
		function(err, user) {
			if (err) {
				console.log(err);
			} else {
				passport.authenticate('local')(req, res, function() {
					res.redirect('/secret');
				});
			}
		}
	);
});

//======================================
app.get('/login', function(req, res) {
	res.render('login');
});
app.post('/login', passport.authenticate('local', { successRedirect: '/secret', failureRedirect: '/login' }), function(
	req,
	res
) {});

//=================================================
app.listen(3000, function() {
	console.log('Authh server has started');
});
