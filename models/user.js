const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema(
	{
		email: { type: String },
		password: { type: String },
		apiKey: [
			{
				key: { type: String },
				expirationDate: { type: Date, default: null },
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
