let express = require("express");
let router = express.Router();
let Campground = require("../models/campground");
let middleware = require("../middleware");

router.get("/", function(req, res){
	if(req.query.search){
		const regex = new RegExp(escapeRegex(req.query.search), "gi");
		Campground.find({$or: [{name: regex,}, {location: regex}, {"author.username":regex}]}, function(err, allCampgrounds){
				if(err)
					console.log(err);
				else{
					if(allCampgrounds < 1){
						req.flash("error", "Campground not found");
                        return res.redirect("back");
					}
					res.render("campgrounds/index", {campgrounds: allCampgrounds, page: "campgrounds"});
				}
		});
	}	else{
			Campground.find({},function(err, allCampgrounds){
				if(err)
					console.log(err);
				else{
					res.render("campgrounds/index", {campgrounds: allCampgrounds, page: "campgrounds"});
				}
});
	}
});


router.post("/", middleware.isLoggedIn,function(req, res){
	let name = req.body.name;
	let price = req.body.price;
	let image = req.body.image;
	let desc = req.body.description;
	let location = req.body.location;
	let author = 	{
					id: req.user.id,
					username: req.user.username
					};
	
	let newCampground = {name: name, image: image, description: desc, author: author, price: price, location: location};
	Campground.create(newCampground, function(err, created){
	if(err){
		console.log(err);
	} else {
		res.redirect("/campgrounds");
	}
	});
});

router.get("/new", middleware.isLoggedIn,function(req, res){
	res.render("campgrounds/new");
});

router.get("/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
	if(err || !foundCampground){
		req.flash("error", "Campground not found");
		res.redirect("back");
	} else{
	res.render("campgrounds/show", {campground: foundCampground});
	}
	});
});

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
	});
	
});

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}	else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err);
		}
		res.redirect("/campgrounds");
	});
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports = router;