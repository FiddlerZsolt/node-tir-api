"use strict";

const bcrypt = require("bcrypt");
const moment = require("moment");
const hat = require("hat");
const DbMixin = require("../mixins/db.mixin");
const User = require("../models/user");
const helperMixin = require("../mixins/helper.mixin");

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

/** @type {ServiceSchema} */
module.exports = {
	name: "users",
	// version: 1

	/**
	 * Mixins
	 */
	mixins: [DbMixin("user"), helperMixin],

	model: User,

	/**
	 * Settings
	 */
	settings: {
		// Available fields in the responses
		fields: ["_id", "email", "password", "apiKey", "bio", "fullName", "role"],
	},

	/**
	 * Actions
	 */
	actions: {
		registration: {
			rest: "POST /", // /api/users/
			params: {
				email: "email",
				bio: {
					type: "string",
					empty: false,
					optional: true,
				},
				fullName: {
					type: "string",
					empty: false,
					optional: true,
				},
				password: {
					type: "string",
					pattern: /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])(?=.*[a-z]).{8,}$/g,
				},
			},
			async handler(ctx) {
				try {
					const { email, password, bio, fullName } = ctx.params;

					const exists = await this.adapter.findOne({ email });

					if (exists) {
						throw new Error("USER_IS_EXISTS");
					}

					const userData = {
						email,
						bio,
						fullName,
						password: this.generateHash(password),
					};

					const user = await this.adapter.insert(userData);

					user.apiKey.push(this.generateToken());

					await user.save();

					return this.formatUser(user);
				} catch (error) {
					this.errorHandler(error);
				}
			},
		},
	},

	/**
	 * Methods
	 */
	methods: {
		generateHash(str) {
			return bcrypt.hashSync(str, 10);
		},
		generateToken() {
			return {
				key: hat(),
				expirationDate: moment().add(4, "hours").toISOString(),
			};
		},
		formatUser(userData) {
			return {
				email: userData.email,
				bio: userData.bio || "",
				fullName: userData.fullName || "",
				apiKey: userData.apiKey[0].key,
				role: userData.role,
			};
		},
	},

	/**
	 * Fired after database connection establishing.
	 */
	async afterConnected() {
		// await this.adapter.collection.createIndex({ name: 1 });
	},
};
