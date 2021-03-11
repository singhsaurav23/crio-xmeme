require('dotenv').config();
var express = require("express"),
	app = express(),
    methodOverride = require("method-override"),
    bodyParser = require("body-parser"),
	mongoose = require("mongoose");

//Meme Database 
const Meme = require("./models/meme");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

//mongod connection
var db_url = 'mongodb://localhost:27017/memes' || process.env.DB_URL;
mongoose.connect(db_url);

//view engine for frontend
app.set("view engine", "ejs");

//css static folder
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));


app.get("/", function(req, res){
	//redirect status code
	res.status(300).redirect("/memes");
});

//Home Page
app.get("/memes", function(req, res){
	Meme.find({}, function(err, memes){
			  if(err){ 
				  //server error code
				res.status(500).send('Something broke!');
			  }
		else res.status(200).render("index",{memes: memes});
  });
});

//Get New meme page
app.get("/memes/new", function(req,res){
		res.status(200).render("new");
		});

//Create new meme post request		
app.post("/memes", function(req, res){
	Meme.find({name: req.body.meme.name,image: req.body.meme.image, caption: req.body.meme.caption}, function (err, mem) {
        if (mem.length){
            res.status(409).send('Already exists');
        }else{
			Meme.create(req.body.meme, function(err,newMeme){
				if(err) res.render("new");
				else res.redirect("/memes");
			})
        }
    });
});

//Render a particular meme with id
app.get("/memes/:id", function(req, res){
	Meme.findById(req.params.id, function(err, foundMeme){
		if(err){
			//redirect status code
			res.status(300).redirect("/memes");
		}
		else{
			res.status(200).render("show",{meme: foundMeme}); 
		}
	})
});

//Get Edit page
app.get("/memes/:id/edit", function(req, res){
		Meme.findById(req.params.id, function(err, foundMeme){
		if(err){
			//redirect status code
			res.status(300).redirect("/memes");
		}
	else res.status(200).render("edit",{meme: foundMeme});
			});
});

//Update with Patch request
app.patch("/memes/:id", function(req, res){
	Meme.find({name: req.body.meme.name,image: req.body.meme.image, caption: req.body.meme.caption}, function (err, mem) {
        if (mem.length){
            res.status(409).send('Already exists');
        }else{
			Meme.findByIdAndUpdate(req.params.id, req.body.meme, function(err, updatedMeme){
				if(err){
					//redirect status code
					res.status(300).redirect("/memes");
				}
				else res.redirect("/memes/"+ req.params.id);
			});
        }
})
});

//delete a meme
app.delete("/memes/:id", function(req, res){
	Meme.findByIdAndRemove(req.params.id, function(err){
		if(err){
			//redirect status code
			res.status(300).redirect("/memes");;
		}
		else res.redirect("/memes");
	});
});

app.all('*',(req, res, next) => {
	//client error code
  res.status(404).send('Not found');
});



//Server running on 8081 port locally
var port = process.env.PORT || 8081;
app.listen(port, function () {

  console.log("The MemeStream server has started!");

});