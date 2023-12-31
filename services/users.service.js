"use strict";

const bcrypt = require("bcrypt");
const moment = require("moment");
const hat = require("hat");
const DbMixin = require("../mixins/db.mixin");
const User = require("../models/user");
const helperMixin = require("../mixins/helper.mixin");
const { TirError } = require("../errors/TirError");
const { ROLES } = require("../models/enum");

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
			auth: false,
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
						throw new TirError("E-mail already exists", 400, "BAD_REQUEST");
					}

					const userData = {
						email,
						bio,
						fullName,
						password: this.generateHash(password),
					};

					const user = await this.adapter.insert(userData);

					const token = this.generateToken();
					user.apiKey.push(token);

					await user.save();

					return this.formatUser(user, token);
				} catch (error) {
					this.errorHandler(error);
				}
			},
		},

		authTest: {
			rest: "GET /authTest", // /api/users/authTest/
			async handler(ctx) {
				return ctx.meta.user;
			},
		},

		login: {
			rest: "GET /login", // /api/users/authTest/
			auth: false,
			params: {
				email: "email",
				password: {
					type: "string",
					empty: false,
				},
			},
			async handler(ctx) {
				const { email, password } = ctx.params;
				try {
					const user = await this.adapter.findOne({ email });

					if (!user) {
						throw new TirError("Invalid e-mail or password");
					}

					const validatePassword = this.comparePassword(
						password,
						user.password
					);

					if (!validatePassword) {
						throw new TirError("Invalid e-mail or password");
					}

					const token = this.generateToken();
					user.apiKey.push(token);

					await user.save();

					return this.formatUser(user, token);
				} catch (error) {
					this.errorHandler(error);
				}
			},
		},

		getUserProfile: {
			rest: "GET /me", // /api/users/me/
			async handler(ctx) {
				const { user } = ctx.meta;
				try {
					const userById = await this.adapter.findById(user._id);
					return this.formatUser(userById);
				} catch (error) {
					this.errorHandler(error);
				}
			},
		},

		updateUser: {
			rest: "PUT /:id", // /api/users/{id}
			params: {
				id: {
					type: "string",
					empty: false,
				},
				email: {
					type: "email",
					optional: true,
				},
				bio: {
					type: "string",
					optional: true,
				},
				fullName: {
					type: "string",
					empty: false,
					optional: true,
				},
			},
			async handler(ctx) {
				const { id, email, bio, fullName } = ctx.params;
				try {
					const userToUpdate = await this.adapter.findById(id);

					if (email) {
						userToUpdate.email = email;
					}

					if (bio) {
						userToUpdate.bio = bio;
					}

					if (fullName) {
						userToUpdate.fullName = fullName;
					}

					await userToUpdate.save();

					return this.formatUser(userToUpdate);
				} catch (error) {
					this.errorHandler(error);
				}
			},
		},

		updateUserPassword: {
			rest: "PUT /:id/password", // /api/users/{id}/password
			params: {
				id: {
					type: "string",
					empty: false,
				},
				password: {
					type: "string",
					pattern: /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])(?=.*[a-z]).{8,}$/g,
					message:
						"The password must inculde lower and uppercase letters, number and symbols",
				},
			},
			async handler(ctx) {
				const { id, password } = ctx.params;
				try {
					const userToUpdate = await this.adapter.findById(id);

					userToUpdate.password = this.generateHash(password);

					await userToUpdate.save();
					return this.formatUser(userToUpdate);
				} catch (error) {
					this.errorHandler(error);
				}
			},
		},

		addRole: {
			role: ROLES.SUPERVISOR,
			rest: "PUT /:id/role", // /api/users/{id}/role
			params: {
				id: {
					type: "string",
					empty: false,
				},
				role: {
					type: "string",
					empty: false,
					optional: true,
				},
			},
			async handler(ctx) {
				const { id, role } = ctx.params;

				// Check if role is valid
				if (!role || !ROLES[role]) {
					throw new TirError("Invalid role", 400, "BAD_REQUEST");
				}

				try {
					const userToUpdate = await this.adapter.findById(id);

					userToUpdate.role = role;

					await userToUpdate.save();
					return this.formatUser(userToUpdate);
				} catch (error) {
					this.errorHandler(error);
				}
			},
		},

		deleteUser: {
			rest: "DELETE /:id", // /api/users/{id}
			params: {
				id: {
					type: "string",
					empty: false,
				},
			},
			async handler(ctx) {
				const { id } = ctx.params;
				try {
					const userToDelete = await this.adapter.removeById(id);

					return { success: !!userToDelete };
				} catch (error) {
					this.errorHandler(error);
				}
			},
		},

		findByAuthToken: {
			visibility: "protected",
			params: {
				token: {
					type: "string",
					empty: false,
				},
			},
			async handler(ctx) {
				const { token } = ctx.params;
				try {
					const user = await this.adapter.findOne({ "apiKey.key": token });

					return user;
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
		formatUser(userData, token = null) {
			const formattedUser = {
				email: userData.email,
				bio: userData.bio || "",
				fullName: userData.fullName || "",
				role: userData.role,
			};

			if (token) {
				formattedUser.apiKey = token?.key;
			}

			return formattedUser;
		},
	},

	/**
	 * Fired after database connection establishing.
	 */
	async afterConnected() {
		// await this.adapter.collection.createIndex({ name: 1 });
	},
};
