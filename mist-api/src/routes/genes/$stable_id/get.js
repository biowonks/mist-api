'use strict'

module.exports = function(app, middlewares, routeMiddlewares) {
	let models = app.get('models'),
		helper = app.get('lib').RouteHelper.for(models.Gene)

	return [
		middlewares.parseCriteria(models.Gene, {
			accessibleModels: [
				models.Genome,
				models.Component,
				models.Aseq,
				models.Dseq
			]
		}),
		helper.findHandler('stable_id')
	]
}

module.exports.docs = function(modelExamples) {
	return {
		name: 'Fetch Gene',
		description: 'Returns a single gene',
		example: {
			request: {
				parameters: {
					stable_id: modelExamples.Gene.stable_id
				}
			},
			response: {
				body: modelExamples.Gene
			}
		}
	}
}
