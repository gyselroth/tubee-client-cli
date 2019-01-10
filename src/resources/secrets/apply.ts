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
    var update = false;

    return this.api.getSecret(resource.name).then((response) => {
      update = true;
      let to = resource;
      let from = response.response.toJSON().body;
      let patch = jsonpatch.compare(from, to);
      return this.api.updateSecret(resource.name, patch);  
    }).catch((error) => {
      if(update === true) {
        throw error;
      }

      return this.api.addSecret(resource);  
    })
  }
}
