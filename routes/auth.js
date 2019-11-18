const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const localStrategy = require("passport-local");

// index route
router.get("/", function(req, res){
    res.render("index");
});

// register route
router.get("/register", function(req, res){
    res.render("register");
});

router.post("/register", function(req, res){
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/cars");
            });
        }
    });
});

// login route
router.get("/login", function(req, res){
    res.render("login");
});

router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/cars",
        failureRedirect: "/login"
    }), function(req, res){
    }
);

// logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("succes", "Bye!");
    res.redirect("/cars");
});


module.exports = router;