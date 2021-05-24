
require('dotenv').config();
const express = require('express')
const passport = require('passport')
const session = require('express-session')
const LocalStrategy = require('passport-local').Strategy
const path = require('path');
const fs = require('fs');
const embed = require('./embed.js');
const app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
  extended: false
}))
const users = require('./users.js');
const yargs = require('yargs');

const argv = yargs
    .option('port', {
        alias: 'p',
        description: 'Specify which port to listen on',
        default: 3001,
        type: 'number',
    })
    .help()
    .alias('help', 'h')
    .argv;

function findUser (username, callback) {
  user = users.find(user => {
    return user.username === username
  })
  if (user) {
    return callback(null, user)
  }
  return callback(null)
}

passport.serializeUser(function (user, cb) {
  cb(null, user.username)
})

passport.deserializeUser(function (username, cb) {
  findUser(username, cb)
})

passport.use(new LocalStrategy(
  function(username, password, done) {
    findUser(username, (err, user) => {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      return done(null, user);
    });
  }
));

function authenticationMiddleware () {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/')
  }
}

passport.authenticationMiddleware = authenticationMiddleware;

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())



if (!process.env.EMBED_ID || !process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.EMBED_TYPE ) {
  console.log('The following variables must be declared in your .env file: EMBED_ID, CLIENT_ID, CLIENT_SECRET, EMBED_TYPE.');
  return;
}

app.get('/embed/items/:itemId', passport.authenticationMiddleware(), (req, res, next) => {
  const config = req.user.config['visualization'+req.params.itemId];
  if (config.embedId) {
    embed.handleRequest(req, res, next, req.user.config['visualization'+req.params.itemId]);
  } else {
    next(`The EMBED_ID${req.params.itemId} environment variable in your .env file is not set. Please set this in order to view content here.`);
  }
});

app.get('/embed/page', passport.authenticationMiddleware(), (req, res, next) => {
  embed.showFilters(req, res);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'/login.html'));
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/'
}))


app.get('/dashboard', passport.authenticationMiddleware(), (req, res, next) => {
  fs.readFile(path.join(__dirname, process.env.USE_XHR ? 'sample_xhr.html' : 'sample.html'), 'utf8', function(err, contents) {
    let newContents = contents.replace('USER', `${req.user.username}`);
    newContents = newContents.replace('REPLACE_IFRAME_FROM_ENV', process.env.REPLACE_IFRAME);
    res.send(newContents);
  });
});

app.use(express.static('public'))

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.listen(argv.port, () => console.log(`Example app listening on port http://localhost:${argv.port}/`))
