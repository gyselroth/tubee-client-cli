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
    return this.api.getAccessRule(resource.name).then((response) => {
      let to = resource;
      let from = response.response.toJSON().body;
      let patch = jsonpatch.compare(to, from);
      return this.api.updateAccessRule(resource.name, patch);  
    }).catch((error) => {
      return this.api.addAccessRule(resource);  
    })
  }
}
