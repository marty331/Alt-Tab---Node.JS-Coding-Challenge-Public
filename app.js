'use strict';

let express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');

mongoose.Promise = global.Promise;

const users = require('./routes/user_routes');


require('./models/users');

let app = express();


/* Your code */


module.exports = app;

mongoose.connect('mongodb://localhost:27017/upstack', {
	useNewUrlParser: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('error connecting to mongo =', err));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('connected to Mongodb');
});

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.use(cookieParser());

// CORS Middleware
app.use(cors());

app.use(session({
  secret: 'kljlajfio8(^Y(G*^E%T',
  resave: true,
  saveUninitialized: true
}));


// passport middleware

app.use(passport.initialize());
app.use(passport.session());

//Passport config
require('./config/passport')(passport);

// Use routes
app.use('/api', users);

// Set port
const port = '8080';
app.set('port', port);

// create the HTTP server

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`running on localhost: ${port}`);
  // console.log('process env =', process.env)
});
