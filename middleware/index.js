let Campground = require("../models/campground");
let Comment = require("../models/comment");
let User = require("../models/user");

let middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err || !foundCampground){
				req.flash("error", "Campground not found");
				res.redirect("back");
		}	else{
				if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
					next();
				} else{
					req.flash("error", "You don't have permission to do that!");
					res.redirect("back");
				}
		}
	});
	} else {
		req.flash("error", "You need to be logged in in order to do that!");
		res.redirect("/login");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err || !foundComment){
				req.flash("error", "Comment not found");
				res.redirect("back");
		}	else{
				if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
					next();
				} else{
					req.flash("error", "You don't have permission to do that!");
					res.redirect("back");
				}
				
		}
	});
	} else {
		req.flash("error", "You need to be logged in in order to do that!");
		res.redirect("back");
	}
}

middlewareObj.checkProfileOwnership = function(req, res ,next){
	if(req.isAuthenticated()){
		User.findById(req.params.id, function(err, foundUser){
			if(err || !foundUser){
				req.flash("error", "Something went wrong!");
				res.redirect("back");
			}
			else{
				if(foundUser._id.equals(req.user._id)){
					next();
				}
				else{
					req.flash("error", "You can't edit someone else's profile!");
					res.redirect("back");
				}
			}
		});
	} else{
		req.flash("error", "You need to be logged in in order to do that!");
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that!")
	res.redirect("/login");
}

module.exports = middlewareObj;