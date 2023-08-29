"use strict";

const DbMixin = require("../mixins/db.mixin");

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

/** @type {ServiceSchema} */
module.exports = {
	name: "user",
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
		create: false,
		insert: false,
		update: false,
		remove: false,
		list: false,

		// --- ADDITIONAL ACTIONS ---

		// Warning this section is just an example
		getUser: {
			params: {
				goatSays: {
					type: "string",
					empty: false,
				},
			},
			async handler(ctx) {
				const { goatSays } = ctx.params;
				const user = await this.getUser(1);
				console.log({ user });
				return `${user.name} says: ${goatSays}`;
			},
		},
	},

	/**
	 * Methods
	 */
	methods: {
		async getUser(id) {
			const user = {
				name: "sihl",
			};
			return user;
		},
	},

	/**
	 * Fired after database connection establishing.
	 */
	async afterConnected() {
		// await this.adapter.collection.createIndex({ name: 1 });
	},
};
