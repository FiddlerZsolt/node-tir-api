const { MoleculerError } = require("moleculer").Errors;

class TirError extends MoleculerError {
	constructor(msg, code = 422, type = "UNPROCESSABLE_ENTITY") {
		super(msg, code, type);
	}
}

module.exports = {
	TirError,
};
