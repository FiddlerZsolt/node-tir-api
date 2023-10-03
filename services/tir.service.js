"use strict";
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

/**
 * @type {ServiceSchema}
 */
module.exports = {
	name: "tir",

	settings: {
		engineHost: "tir-engine-grpc:3001",
		protoPath: path.join(__dirname, "/../tir-engine-grpc/proto/tir.proto"),
		packageDefinition: protoLoader.loadSync(
			path.join(__dirname, "/../tir-engine-grpc/proto/tir.proto")
		),
	},

	actions: {
		get: false,
		find: false,
		count: false,
		create: false,
		insert: false,
		update: false,
		remove: false,
		list: false,
	},

	methods: {
		/**
		 * Request
		 * @typedef {Object} ThematicObject
		 * @property {string} title
		 * @property {Array<Topic>} topics
		 */

		/**
		 * Request
		 * @typedef {Object} Topic
		 * @property {string} explanation
		 * @property {string} title
		 */

		/**
		 * @param {ThematicObject} thematic
		 */
		async generateKnowledge(thematic) {
			console.log("thematic", thematic);
			try {
				const knowledge = await this.client.GenerateKnowledge(thematic);
				return knowledge;
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		/**
		 *
		 * @typedef {Object} Answer
		 * @property {string} answer
		 * @property {Topic} topic
		 *
		 */

		/**
		 *
		 * @param {Answer} answer
		 */
		async evaulateAnswer(answer) {
			try {
				const evaulatedAnswer = await this.client.EvaulateAnswer(answer);
				return evaulatedAnswer;
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		/**
		 *
		 * @typedef {Object} Explanation
		 * @property {string} correction
		 * @property {Topic} topic
		 */

		/**
		 *
		 * @param {Explanation} explanation
		 */
		async correctExplanation(explanation) {
			try {
				const correctExplanation = await this.client.CorrectExplanation(
					explanation
				);
				return correctExplanation;
			} catch (error) {
				console.log(error);
				throw error;
			}
		},
	},
	created() {
		const { TirService } = grpc.loadPackageDefinition(
			this.settings.packageDefinition
		).tir;
		this.client = new TirService(
			this.settings.engineHost,
			grpc.credentials.createInsecure()
		);
	},
};
