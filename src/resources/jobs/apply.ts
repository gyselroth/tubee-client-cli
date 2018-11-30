import AbstractApply from '../abstract.apply';
const jsonpatch = require('fast-json-patch');

/**
 * Create or update resources
 */
export default class Apply extends AbstractApply {
  /**
   * Apply
   */
  public async apply(resource) {
    return this.api.getJob(resource.name).then((response) => {
      let to = resource;
      let from = response.body;
      let patch = jsonpatch.compare(to, from);
      return this.api.updateJob(resource.name, patch);  
    }).catch((error) => {
      return this.api.addJob(resource);  
    })
  }
}
