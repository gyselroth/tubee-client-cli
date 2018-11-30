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
    var api = await this.client.factory('AccessRoles', this.optparse.parent.parsedOpts);
    
    return api.getAccessRole(resource.name).then((response) => {
      let to = resource;
      let from = response.body;
      let patch = jsonpatch.compare(to, from);
      return api.updateAccessRole(resource.name, patch);  
    }).catch((error) => {
      return api.addAccessRole(resource);  
    })
  }
}
