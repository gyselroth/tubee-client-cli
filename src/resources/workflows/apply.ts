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
    var api = await this.client.factory('Workflows', this.optparse.parent.parsedOpts);

    let namespace = resource.namespace;
    delete resource.namespace;
    let collection = resource.collection;
    delete resource.collection;
    let endpoint = resource.endpoint;
    delete resource.endpoint;
    
    return api.getWorkflow(namespace, collection, endpoint, resource.name).then((response) => {
      let to = resource;
      let from = response.body;
      let patch = jsonpatch.compare(to, from);
      return api.updateWorkflow(namespace, collection, endpoint, resource.name, patch);  
    }).catch((error) => {
      return api.addWorkflow(namespace, collection, resource);  
    })
  }
}
