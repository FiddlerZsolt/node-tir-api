const mongoose = require("mongoose");

const TopicSchema = new mongoose.Schema(
	{
		title: { type: String },
		rate: { type: Number },
		explanation: { type: String },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Topic", TopicSchema);