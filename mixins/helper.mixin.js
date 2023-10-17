"use strict";

const bcrypt = require("bcrypt");
const { TirError } = require("../errors/TirError");

module.exports = {
	name: "helper",

	methods: {
		// logMessage(message) {
		// 	this.broker.logger.info(`>>>>>>>>> [${this.name}] ${message}`);
		// },
		logMessage(message) {
			console.log(`\n>>>>>>>>> [${this.name}] ${message}`);
		},
		errorHandler(error) {
			console.log("\n>>>>>>>>> [ERROR]");
			console.log(error);

			if (error instanceof TirError) {
				throw error;
			}

			throw new TirError("Unhandled error", 500, "INTERNAL_SERVER_ERROR");
		},

		hashPassword(str) {
			return bcrypt.hashSync(str, 10);
		},

		comparePassword(password, hash) {
			return bcrypt.compareSync(password, hash);
		},
	},
};
