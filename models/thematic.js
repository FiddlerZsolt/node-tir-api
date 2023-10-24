const mongoose = require("mongoose");
const Topic = require("./topic");

const ThematicSchema = new mongoose.Schema(
	{
		title: { type: String },
		topics: [Topic],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Thematic", ThematicSchema);