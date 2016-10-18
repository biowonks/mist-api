'use strict'

// Core
const path = require('path'),
	child_process = require('child_process') // eslint-disable-line camelcase

// Vendor
const pumpify = require('pumpify'),
	duplexChildProcess = require('duplex-child-process')

// Local
let config = require('../../../config'),
	hmmscanResultStream = require('./hmmscan-result-stream'),
	streamMixins = require('mist-lib/streams/stream-mixins')

// Constants
const kHmmscanPath = path.resolve(config.vendor.hmmer3.binPath, 'hmmscan')

/**
 * @param {String} hmmDatabaseFile - path to source hmm database file
 * @param {Number} [z = null] - number of HMMs in hmmDatabaseFile by which to calculate the resulting E_values
 * @param {Number} [cpus = null] - number of CPUs to use in parallel
 * @returns {DuplexStream} - expects FASTA input to be stream as input
 */
module.exports = function(hmmDatabaseFile, z = null, cpus = null) {
	let hmmscanTool = duplexChildProcess.spawn(kHmmscanPath, hmmscanArgs(hmmDatabaseFile, '-', z, cpus)),
		parser = hmmscanResultStream(),
		pipeline = pumpify.obj(hmmscanTool, parser)

	streamMixins.all(pipeline)

	return pipeline
}

/**
 * @param {String} hmmDatabaseFile - path to source hmm database file
 * @param {String} [fastaFile='-'] - path to fasta file to run hmmer against; defaults to '-' (STDIN)
 * @param {Number} [z=null] - number of HMMs in hmmDatabaseFile by which to calculate the resulting E_values
 * @returns {Stream}
 */
module.exports.file = function(hmmDatabaseFile, fastaFile, z = null) {
	if (typeof fastaFile !== 'string')
		throw new Error('fastaFile argument must be a string')

	let hmmscanTool = child_process.spawn(kHmmscanPath, hmmscanArgs(hmmDatabaseFile, fastaFile, z))
	return pumpify.obj(hmmscanTool.stdout, hmmscanResultStream())
}

/**
 * @param {String} hmmDatabaseFile - path to source hmm database file
 * @param {String} [fastaFile='-'] - path to fasta file to run hmmer against; defaults to '-' (STDIN)
 * @param {Number} [z=null] - number of HMMs in hmmDatabaseFile by which to calculate the resulting E_values
 * @param {Number} [cpus = null] - number of CPUs to use in parallel
 * @returns {Array.<String>} - arguments to pass to hmmscan
 */
function hmmscanArgs(hmmDatabaseFile, fastaFile = '-', z = null, cpus = null) {
	let args = ['--noali', '--cut_ga']
	if (z) {
		args.push('-Z')
		args.push(z)
	}
	if (cpus) {
		if (!/^[1-9]\d*$/.test(cpus))
			throw new Error('cpus argument must be a positive integer')

		args.push('--cpu')
		args.push(Number(cpus))
	}
	args.push(hmmDatabaseFile)
	args.push(fastaFile)
	return args
}
