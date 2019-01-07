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
    let obj = resource.object;
    delete resource.object;   

    return this.api.getRelative(namespace, collection, resource.name).then((response) => {
      let to = resource;
      let from = response.response.toJSON().body;
      let patch = jsonpatch.compare(to, from);
      return this.api.updateRelative(namespace, collection, obj, resource.name, patch);  
    }).catch((error) => {
      return this.api.addRelative(namespace, collection, obj, resource);  
    })
  }
}
