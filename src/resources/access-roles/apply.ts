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
    return this.api.getAccessRole(resource.name).then((response) => {
      let to = resource;
      let from = response.response.toJSON().body;
      let patch = jsonpatch.compare(to, from);
      return this.api.updateAccessRole(resource.name, patch);  
    }).catch((error) => {
      return this.api.addAccessRole(resource);  
    })
  }
}
