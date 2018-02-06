'use strict'

// Vendor
const _ = require('lodash')

// Local
const util = require('core-lib/util')

module.exports = function(app, middlewares, routeMiddlewares) {
	let models = app.get('models'),
		helper = app.get('lib').RouteHelper.for(models.Genome)

	const taxonomyTextFieldNames = [
		'superkingdom',
		'phylum',
		'class',
		'order',
		'family',
		'genus',
		'assembly_level',
	]

	const checkAndGetTerms = (queryValue, target, modelFieldName) => {
		if (!queryValue)
			return

		if (!target || !modelFieldName)
			throw new Error('processWhereTextCondition must have a defined target and modelFieldName')

		return util.splitIntoTerms(queryValue).map((term) => `%${term}%`)
	}

	const processSearch = (queryValue, target, modelFieldName) => {
		const terms = checkAndGetTerms(queryValue, target, modelFieldName)
		if (terms.length > 0) {
			_.set(target, `criteria.where.$or.${modelFieldName}.$ilike.$any`, terms)
			taxonomyTextFieldNames
			.forEach((fieldName) => {
				_.set(target, `criteria.where.$or.${fieldName}.$ilike.$any`, terms)
			})
		}
	}

	const processWhereTextCondition = (queryValue, target, modelFieldName) => {
		const terms = checkAndGetTerms(queryValue, target, modelFieldName)
		if (terms.length > 0) {
			_.set(target, `criteria.where.${modelFieldName}.$ilike.$any`, terms)
		}
	}

	return [
		middlewares.parseCriteriaForMany(models.Genome, {
			accessibleModels: [
				models.WorkerModule,
				models.Component
			],
			maxPage: null,
			permittedOrderFields: '*',
			permittedWhereFields: [
				'taxonomy_id',
				...taxonomyTextFieldNames,
			],
		}),
		(req, res, next) => {
			// Provide for searching against name
			if (Reflect.has(req.query, 'search'))
				processSearch(req.query.search, res.locals, 'name')
			// Handle searching taxonomy
			taxonomyTextFieldNames
			.forEach((fieldName) => {
				const queryValue = _.get(res.locals, `criteria.where.${fieldName}`)
				if (queryValue)
					processWhereTextCondition(queryValue, res.locals, fieldName)
			})

			next()
		},
		helper.findManyHandler()
	]
}

module.exports.docs = function(modelExamples) {
	return {
		name: 'Fetch Many Genomes',
		description: 'Returns an array of <a href="#genome-model">Genomes</a>.',
		method: null,
		uri: null,
		parameters: null,
		example: {
			response: {
				body: [
					modelExamples.Genome
				]
			}
		},
		har: null
	}
}
