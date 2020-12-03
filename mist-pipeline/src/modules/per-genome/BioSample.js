'use strict';

// Local
const PerGenomePipelineModule = require('lib/PerGenomePipelineModule');

module.exports =
class BioSample extends PerGenomePipelineModule {
  static description() {
    return 'fetches biosample data from NCBI';
  }

  constructor(app, genome) {
    super(app, genome);
    this.bioSampleService = app.bioSampleService;
    this.BioSample_ = this.models_.BioSample;
  }

  async run() {
    const bioSampleAccession = this.genome_.biosample;
    const bioSample = await this.BioSample_.findByPk(bioSampleAccession);
    if (bioSample) {
      this.logger_.info(`BioSample data already exists for: ${bioSampleAccession}`);
      return null;
    }

    const data = await this.bioSampleService.fetchForAccession(bioSampleAccession);
    const bioSampleRecord = await this.BioSample_.create(data);
    this.logger_.info(`Created BioSample record for: ${bioSampleRecord.id}`);
  }
};
