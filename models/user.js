const mongoose = require("mongoose");
const { ROLES } = require("./enum");

const ApiKeySchema = new mongoose.Schema({
	key: { type: String },
	expirationDate: { type: Date, default: null },
});

const UserSchema = new mongoose.Schema(
	{
		email: { type: String },
		password: { type: String },
		bio: { type: String },
		fullName: { type: String },
		role: {
			type: String,
			enum: Object.values(ROLES),
			default: ROLES.MEMBER,
		},
		apiKey: {
			type: [ApiKeySchema],
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
