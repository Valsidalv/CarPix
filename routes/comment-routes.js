const express = require("express");
const router = express.Router();
const Comment = require("../models/comment");
const Car = require("../models/car");
const middleware = require("../middleware");

// new comment form
router.get("/cars/:id/comments/new-comment", middleware.isLoggedIn, function(req, res){
    Car.findById(req.params.id, function(err, car){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new-comment", { car: car });
        }
    });
});

// add comment route
router.post("/cars/:id/comments", middleware.isLoggedIn, function(req, res){
    Car.findById(req.params.id, function(err, foundCar){
        if(err){
            console.log(err);
        } else {
            Comment.create(req.body.comment, function(err, newComment){
                if(err){
                    console.log(err);
                } else {
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    newComment.save();
                    foundCar.comments.push(newComment);
                    foundCar.save();
                    req.flash("success", "Comment added.");
                    res.redirect("/cars/" + foundCar._id);
                }
            }); 
        }
    });
});

// edit comment route
router.get("/cars/:id/comments/:comment_id/edit", middleware.checkCommentAuthor, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComm){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit-comment", { car_id: req.params.id, comment: foundComm });
        }
    });
});

router.put("/cars/:id/comments/:comment_id", middleware.checkCommentAuthor, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updateComm){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment changed.");
            res.redirect("/cars/" + req.params.id);
        }
    })
});

// delete comment
router.delete("/cars/:id/comments/:comment_id", middleware.checkCommentAuthor,  function(req, res){
    Comment.findByIdAndDelete(req.params.comment_id, function(err, comment){
        if(err){
            res.redirect("back");
        }  else {
            req.flash("success", "Comment removed.");
            res.redirect("/cars/" + req.params.id);
        }
    })
});

module.exports = router;