var Car = require("./models/car");
var Comment = require("./models/comment");

var middleware = {
    checkCarAuthor: function(req, res, next){
        if(req.isAuthenticated()){
            Car.findById(req.params.id, function(err, foundCar){
                if(err){
                    res.redirect("back");
                } else {
                    // does user own the car?
                    if(foundCar.author.id.equals(req.user._id)){
                        next();
                    } else {
                        req.flash("error", "You are not authorized to do that.");
                        res.redirect("back");
                    }
                }
            });
        } else {
            res.redirect("back");
        }
    },
    checkCommentAuthor: function(req, res, next){
        if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, function(err, foundComment){
                if(err){
                    res.redirect("back");
                } else {
                    // does user own the comment?
                    if(foundComment.author.id.equals(req.user._id)){
                        next();
                    } else {
                        res.redirect("back");
                    }
                }
            });
        } else {
            res.redirect("back");
        }
    },
    isLoggedIn: function(req, res, next){
        if(req.isAuthenticated()){
            next();
        } else {
            req.flash("error", "Log in first!");
            res.redirect("/login");
        }
    }
};

module.exports = middleware;