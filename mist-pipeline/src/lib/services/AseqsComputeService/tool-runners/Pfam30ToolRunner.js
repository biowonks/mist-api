'use strict'

// Local
const FastaStreamToolRunner = require('./FastaStreamToolRunner'),
	hmmscanStream = require('lib/streams/hmmscan-stream')

module.exports =
class Pfam30ToolRunner extends FastaStreamToolRunner {
	handleResult_(aseq, result) {
		aseq.pfam30 = result.domains
	}

	toolStream_() {
		return hmmscanStream(this.config_.databasePath, this.config_.z, this.config_.cpus)
	}
}

module.exports.meta = {
	id: 'pfam30',
	description: 'predict pfam30 domains'
}
