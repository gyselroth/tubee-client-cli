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
    
    return this.api.getDataObject(namespace, collection, resource.name).then((response) => {
      let to = resource;
      let from = response.body;
      let patch = jsonpatch.compare(to, from);
      return this.api.updateDataObject(namespace, collection, resource.name, patch);  
    }).catch((error) => {
      return this.api.addDataObject(namespace, collection, resource);  
    })
  }
}
