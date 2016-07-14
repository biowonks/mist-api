/* eslint-disable no-mixed-requires, no-unused-expressions, no-magic-numbers */

'use strict'

// Local
const models = require('../../../models').withDummyConnection(),
	coilsToolRunner = require('./coils.tool-runner')

describe('services', function() {
	describe('AseqsService', function() {
		describe('coils', function() {
			let aseqs = null

			beforeEach(() => {
				aseqs = [
					models.Aseq.build({
						id: '8pduSfpL50c3yCBL08_A9g',
						sequence: 'MNLTLTRRLWMGFALMALLTLTSTLVGWYNLRFISQVEKDNTQALIPTMNMARQLSEASAWELFAAQNLTSADNEKMWQAQGRMLTAQSLKINALLQALREQGFDTTAIEQQEQEISRSLRQQGELVGQRLQLRQQQQQLSQQIVAAADEIARLAQGQANNATTSAGATQAGIYDLIEQDQRQAAESALDRLIDIDLEYVNQMNELRLSALRVQQMVMNLGLEQIQKNAPTLEKQLNNAVKILQRRQIRIEDPGVRAQVATTLTTVSQYSDLLALYQQDSEISNHLQTLAQNNIAQFAQFSSEVSQLVDTIELRNQHGLAHLEKASARGQYSLLLLGMVSLCALILILWRVVYRSVTRPLAEQTQALQRLLDGDIDSPFPETAGVRELDTIGRLMDAFRSNVHALNRHREQLAAQVKARTAELQELVIEHRQARAEAEKASQAKSAFLAAMSHEIRTPLYGILGTAQLLADNPALNAQRDDLRAITDSGESLLTILNDILDYSAIEAGGKNVSVSDEPFEPRPLLESTLQLMSGRVKGRPIRLATAIADDMPCALMGDPRRIRQVITNLLSNALRFTDEGYIILRSRTDGEQWLVEVEDSGCGIDPAKLAEIFQPFVQVSGKRGGTGLGLTISSRLAQAMGGELSATSTPEVGSCFCLRLPLRVATAPVPKTVNQAVRLDGLRLLLIEDNPLTQRITIEMLKTSGAQIVAVGNAAQALETLQNSEPFAAALVDFDLPDIDGITLARQLAQQYPSLVLIGFSAHVIDETLRQRTSSLFRGIIPKPVPREVLGQLLAHYLQLQVNNDQSLDVSQLNEDAQLMGTEKIHEWLVLFTQHALPLLDEIDIARASQDSEKIKRAAHQLKSSCSSLGMHIASQLCAQLEQQPLSAPLPHEEITRSVAALEAWLHKKDLNAI'
					}),
					models.Aseq.build({
						id: 'dYTwPLwRnTYVJoPa7itrFg',
						sequence: 'MKYLASFRTTLKASRYMFRALALVLWLLIAFSSVFYIVNALHQRESEIRQEFNLSSDQAQRFIQRTSDVMKELKYIAENRLSAENGVLSPRGRETQADVPAFEPLFADSDCSAMSNTWRGSLESLAWFMRYWRDNFSAAYDLNRVFLIGSDNLCMANFGLRDMPVERDTALKALHERINKYRNAPQDDSGSNLYWISEGPRPGVGYFYALTPVYLANRLQALLGVEQTIRMENFFLPGTLPMGVTILDENGHTLISLTGPESKIKGDPRWMQERSWFGYTEGFRELVLKKNLPPSSLSIVYSVPVDKVLERIRMLILNAILLNVLAGAALFTLARMYERRIFIPAESDALRLEEHEQFNRKIVASAPVGICILRTADGVNILSNELAHTYLNMLTHEDRQRLTQIICGQQVNFVDVLTSNNTNLQISFVHSRYRNENVAICVLVDVSSRVKMEESLQEMAQAAEQASQSKSMFLATVSHELRTPLYGIIGNLDLLQTKELPKGVDRLVTAMNNSSSLLLKIISDILDFSKIESEQLKIEPREFSPREVMNHITANYLPLVVRKQLGLYCFIEPDVPVALNGDPMRLQQVISNLLSNAIKFTDTGCIVLHVRADGDYLSIRVRDTGVGIPAKEVVRLFDPFFQVGTGVQRNFQGTGLGLAICEKLISMMDGDISVDSEPGMGSQFTVRIPLYGAQYPQKKGVEGLSGKRCWLAVRNASLCQFLETSLQRSGIVVTTYEGQEPTPEDVLITDEVVSKKWQGRAVVTFCRRHIGIPLEKAPGEWVHSVAAPHELPALLARIYLIEMESDDPANALPSTDKAVSDNDDMMILVVDDHPINRRLLADQLGSLGYQCKTANDGVDALNVLSKNHIDIVLSDVNMPNMDGYRLTQRIRQLGLTLPVIGVTANALAEEKQRCLESGMDSCLSKPVTLDVIKQTLTLYAERVRKSRDS'
					})
				]
			})

			it('empty array resolves to empty result array', function() {
				return coilsToolRunner([])
				.then((result) => {
					expect(result).deep.equal([])
				})
			})

			it('computes and updates aseqs coils field (default target field)', function() {
				expect(aseqs[0].coils).not.ok
				expect(aseqs[1].coils).not.ok

				return coilsToolRunner(aseqs)
				.then((resultAseqs) => {
					expect(aseqs === resultAseqs)
					expect(aseqs[0].coils).deep.equal([
						[130, 150],
						[222, 242],
						[409, 443]
					])
					expect(aseqs[1].coils).deep.equal([
						[449, 469]
					])
				})
			})

			it('alternate target field', function() {
				expect(aseqs[0].coils).not.ok
				expect(aseqs[1].coils).not.ok

				return coilsToolRunner(aseqs, 'coilscoils')
				.then((resultAseqs) => {
					expect(aseqs === resultAseqs)
					expect(aseqs[0].coils).not.ok
					expect(aseqs[0].coilscoils).deep.equal([
						[130, 150],
						[222, 242],
						[409, 443]
					])
					expect(aseqs[1].coils).not.ok
					expect(aseqs[1].coilscoils).deep.equal([
						[449, 469]
					])
				})
			})
		})
	})
})
