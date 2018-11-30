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
    var api = await this.client.factory('Data', this.optparse.parent.parsedOpts);

    let namespace = resource.namespace;
    delete resource.namespace;
    let collection = resource.collection;
    delete resource.collection;
    let obj = resource.object;
    delete resource.object;   

    return api.getRelative(namespace, collection, resource.name).then((response) => {
      let to = resource;
      let from = response.body;
      let patch = jsonpatch.compare(to, from);
      return api.updateRelative(namespace, collection, obj, resource.name, patch);  
    }).catch((error) => {
      return api.addRelative(namespace, collection, obj, resource);  
    })
  }
}
