let express 		= 	require("express"),
 	bodyParser 		= 	require("body-parser"),
 	mongoose 		= 	require("mongoose"),
	flash			=	require("connect-flash"),
	passport		=	require("passport"),
	LocalStrategy	=	require("passport-local"),
	methodOverride	=	require("method-override"),
 	Campground 		= 	require("./models/campground"),
	Comment			=	require("./models/comment"),
	User			=	require("./models/user"),
	seedDB			=	require("./seeds")
	app 			= 	express();

let campgroundRoutes	=	require("./routes/campgrounds"),
	commentRoutes		=	require("./routes/comments"),
	indexRoutes			=	require("./routes/index");

let url = process.env.DATABASEURL || "mongodb://localhost/YelpCamp";

mongoose.connect(url , {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
}).then(() => {
	console.log("Connected to database");
}).catch(err => {
	console.log("Error connecting to the database", err.message);
});
//mongoose.connect("mongodb://localhost/YelpCamp" );

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

app.use(require("express-session")({
	secret: "this is no secret help me i need cute anime tiddies",
	resave: false,
	saveUninitialized: false
}));
app.locals.moment = require("moment");
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
	console.log("Listening on port 3000...");
});










