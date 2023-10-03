"use strict";

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
			throw error;
		},
	},
};
