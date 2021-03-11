var mongoose = require("mongoose");

var memeSchema = new mongoose.Schema({
	name: String,
	image: String,
	caption: String,
	created: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Meme", memeSchema);