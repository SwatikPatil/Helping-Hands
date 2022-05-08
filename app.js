const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

//passport config
require('./config/passport')(passport);

//Db config
const db = "mongodb://localhost/Share4Care"

//=====For connecting to mongodb atlas =====//

// userid -> <your mongodb atlas user id>
// password -> <your mongodb atlas password>
// const db = 'mongodb+srv://<userid>:<password>@cluster0-hiqkj.mongodb.net/Share4Care'

//=========================================//

//Mongo Connect
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDb connected...'))
    .catch(err => console.log(err));

//public directory
app.use(express.static(__dirname + "/public"));
app.set("layout extractScripts", true)

//Bodyparser
app.use(express.urlencoded({ extended : true }));

//Express Middleware
app.use(session({
    secret: 'Share4Care',
    resave: true,
    saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 8000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));