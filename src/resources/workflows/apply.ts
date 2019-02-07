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
    let namespace = resource.namespace;
    delete resource.namespace;
    let collection = resource.collection;
    delete resource.collection;
    let endpoint = resource.endpoint;
    delete resource.endpoint;
    
    var update = false;
    return this.api.getWorkflow(namespace, collection, endpoint, resource.name).then(async (response) => {
      update = true;
      let to = resource;
      let from = response.response.toJSON().body;
      let patch = jsonpatch.compare(from, to);
      return await this.api.updateWorkflow(namespace, collection, endpoint, resource.name, patch);  
    }).catch((error) => {
      if(update === true) {
        throw error;
      }

      return this.api.addWorkflow(namespace, collection, endpoint, resource);  
    })
  }
}
