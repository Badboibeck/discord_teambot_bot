function convertMilliseconds(milliseconds) {
	return parseInt(Math.floor(milliseconds / 1000));
}

module.exports = { convertMilliseconds };