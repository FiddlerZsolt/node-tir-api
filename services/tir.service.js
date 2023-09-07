"use strict";
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const PROTO_PATH = path.join(__dirname + "/../tir-engine-grpc/proto/tir.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const TirService = grpc.loadPackageDefinition(packageDefinition).tir.TirService;

const client = new TirService(
	"localhost:50051",
	grpc.credentials.createInsecure()
);

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
		fields: [],
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
				client.GenerateKnowledge({ thematic }, (error, response) => {
					if (error) reject(error);
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
				client.EvaulateAnswer({ answer }, (error, response) => {
					if (error) reject(error);
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
				client.CorrectExplanation(
					{ explanation },
					(error, response) => {
						if (error) reject(error);
						resolve(response);
					}
				);
			});
		},
	},
};
