"use strict";

const bcrypt = require("bcrypt");
const moment = require("moment");
const hat = require("hat");
const DbMixin = require("../mixins/db.mixin");
const User = require("../models/user");
const helperMixin = require("../mixins/helper.mixin");
const ApiGateway = require("moleculer-web");
const { TirError } = require("../errors/TirError");

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
						throw new ApiGateway.Errors.UnAuthorizedError();
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

        let userById;
        try {
          const query = this.adapter.model.findById(user._id).select("email bio fullName role");
          userById = await query.exec();
          console.log(userById);
        } catch (error) {
          this.errorHandler(error);
        }

        const formattedUser = this.formatUser(userById, null, true);
        
        return formattedUser;
      },
    },

		findByAuthToken: {
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
		formatUser(userData, token = null, filterApiKey = false) {
			return {
				email: userData.email,
				bio: userData.bio || "",
				fullName: userData.fullName || "",
        //clear API key from response if filterApiKey is true
				...(() => {
          if (filterApiKey) return {};
          return {
            apiKey: token?.key || null
          };
        })(),
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
