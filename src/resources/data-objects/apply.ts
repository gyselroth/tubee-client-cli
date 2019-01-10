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
    var update = false;    

    return this.api.getObject(namespace, collection, resource.name).then((response) => {
      update = true;
      let to = resource;
      let from = response.response.toJSON().body;
      let patch = jsonpatch.compare(from, to);
      return this.api.updateObject(namespace, collection, resource.name, patch);  
    }).catch((error) => {
console.log(error);
      if(update === true) {
        throw error;
      }

      return this.api.addObject(namespace, collection, resource);  
    })
  }
}
