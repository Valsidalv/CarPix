const express = require("express");
const router = express.Router();
const Car = require("../models/car");
const middleware = require("../middleware");

// view all cars
router.get("/cars", function(req, res){ 
    Car.find({}, function(err, allCars){
        if(err){
            console.log(err);
        } else {
            res.render("cars/cars", { cars: allCars });
        }
    });
});

// add new car
router.post("/cars", middleware.isLoggedIn, function(req, res){ 
    var author = {
        id: req.user._id ,
        username: req.user.username
    };
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCar = {name: name, image: image, description: desc, author: author};
    Car.create(newCar, function(err, newCar){
        if(err){
            console.log(err);
        } else {
            res.redirect("/cars");
        }
    });
});

// new car form
router.get("/cars/new-car", middleware.isLoggedIn, function(req, res){
    res.render("cars/new-car");
});

// view 1 car
router.get("/cars/:id", function(req, res){
    Car.findById(req.params.id).populate("comments").exec(function(err, viewedCar){
        if(err){
            console.log(err);
        } else {
            res.render("cars/view-car", { car: viewedCar });
        }
    });
});

// edit car 
router.get("/cars/:id/edit", middleware.checkCarAuthor, function(req, res){
    Car.findById(req.params.id, function(err, editCar){
        if(err){
            console.log(err);
        } else {
            res.render("cars/edit-car", { car: editCar });
        }
    })
});

router.put("/cars/:id", middleware.checkCarAuthor, function(req, res){
    Car.findByIdAndUpdate(req.params.id, req.body.car, function(err, editCar){
        if(err){
            console.log(err);
        } else {
            res.redirect("/cars/" + req.params.id);
        }
    });
});

// delete car
router.delete("/cars/:id", middleware.checkCarAuthor, function(req, res){
    Car.findByIdAndDelete(req.params.id, function(err, car){
        if(err){
            console.log(err);
        }  else {
            res.redirect("/cars");
        }
    })
});

module.exports = router;