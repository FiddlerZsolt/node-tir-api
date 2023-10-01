"use strict";

const bcrypt = require("bcrypt");
const DbMixin = require("../mixins/db.mixin");
const User = require("../models/user");

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
	mixins: [DbMixin("user")],

	model: User,

	/**
	 * Settings
	 */
	settings: {
		// Available fields in the responses
		fields: ["_id", "email", "password", "apiKey"],
	},

	/**
	 * Actions
	 */
	actions: {
		find: false,
		count: false,
		insert: false,
		update: false,
		remove: false,
		list: false,

		// TODO:
		create: {
			rest: "POST /",
			params: {
				email: {
					type: "email",
				},
				password: {
					type: "string",
					empty: false,
					min: 6,
				},
			},
			async handler(ctx) {
				const { email, password } = ctx.params;
				try {
					this.broker.logger.info(
						`>>>>>>>>> [${this.name}] New registration: ${email}`
					);
					const hashedPassword = this.generateHash(password);
					const user = {
						email: email,
						password: hashedPassword,
					};

					return user;
				} catch (error) {
					console.log(error);
					throw error;
				}
			},
		},

		// TODO:
		get: {
			rest: "GET /:id",
			async handler(ctx) {
				const { id } = ctx.params;
				try {
					return { id };
				} catch (error) {
					console.log(error);
					throw error;
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
	},

	/**
	 * Fired after database connection establishing.
	 */
	async afterConnected() {
		// await this.adapter.collection.createIndex({ name: 1 });
	},
};
