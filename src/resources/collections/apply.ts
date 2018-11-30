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
    var api = await this.client.factory('Collections', this.optparse.parent.parsedOpts);

    let namespace = resource.namespace;
    delete resource.namespace;
    
    return api.getCollection(namespace, resource.name).then((response) => {
      let to = resource;
      let from = response.body;
      let patch = jsonpatch.compare(to, from);
      return api.updateCollection(namespace, resource.name, patch);  
    }).catch((error) => {
      return api.addCollection(namespace, resource);  
    })
  }
}
