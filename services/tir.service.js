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
		engineHost: "localhost:50051",
		protoPath: path.join(__dirname, "/../tir-engine-grpc/proto/tir.proto"),
		packageDefinition: protoLoader.loadSync(path.join(__dirname, "/../tir-engine-grpc/proto/tir.proto")),
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

		generateKnowLedge: {
			async handler(ctx) {
				return this.generateKnowLedge();
			}
		}
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
		generateKnowLedge(thematic) {
			return new Promise((resolve, reject) => {
				this.client.GenerateKnowledge({ thematic }, (error, response) => {
					if (error) return reject(error);
					resolve(response);
				});
			});
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
		evaulateAnswer(answer) {
			return new Promise((resolve, reject) => {
				this.client.EvaulateAnswer({ answer }, (error, response) => {
					if (error) return reject(error);
					resolve(response);
				});
			});
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
		correctExplanation(explanation) {
			return new this.Promise((resolve, reject) => {
				this.client.CorrectExplanation(
					{ explanation },
					(error, response) => {
						if (error) return reject(error);
						resolve(response);
					}
				);
			});
		},
	},
	created() {
		const { TirService } = grpc.loadPackageDefinition(this.settings.packageDefinition).tir;
		this.client = new TirService(
			this.settings.engineHost,
			grpc.credentials.createInsecure()
		);
	}

};
