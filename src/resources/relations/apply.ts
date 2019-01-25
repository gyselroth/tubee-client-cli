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
    var update = false;

    return this.api.getRelation(namespace, resource.name).then((response) => {
      update = true;
      let to = resource;
      let from = response.response.toJSON().body;
      let patch = jsonpatch.compare(from, to);
      return this.api.updateRelation(namespace, resource.name, patch);  
    }).catch((error) => {
      if(update === true) {
        throw error;
      }
      
      return this.api.addRelation(namespace, resource); 
    });
  }
}
