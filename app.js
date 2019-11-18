const
    express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    override = require("method-override"),
    flash = require("connect-flash");

// require models
const 
    Car = require("./models/car"),
    User = require("./models/user"),
    Comment = require("./models/comment");

// require routes
const 
    carRoutes = require("./routes/car-routes"),
    commentRoutes = require("./routes/comment-routes"),
    authRoutes = require("./routes/auth");

// connect to DB
mongoose.connect("mongodb://localhost/cars", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false });

app.set("view engine", "ejs"); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));  // setup folder for css styles
app.use(override("_method"));
app.use(flash());

// passport setup
app.use(require("express-session")({
    secret: "This is a secret for some reason.",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// user that is logged in can be accessed on all pages
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error =  req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// ROUTES
app.use(carRoutes);
app.use(commentRoutes);
app.use(authRoutes);

// listen
app.listen(3300, function(){
    console.log("Car app started.");
});