"use strict";

const DbMixin = require("../mixins/db.mixin");

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

	/**
	 * Settings
	 */
	settings: {
		// Available fields in the responses
		fields: [],
	},

	/**
	 * Actions
	 */
	actions: {
		get: false,
		find: false,
		count: false,
		insert: false,
		update: false,
		remove: false,
		list: false,

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
					return {
						email,
						password,
					};
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
	methods: {},

	/**
	 * Fired after database connection establishing.
	 */
	async afterConnected() {
		// await this.adapter.collection.createIndex({ name: 1 });
	},
};
