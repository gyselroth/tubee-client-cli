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
    var namespace = resource.namespace;
    delete resource.namespace;
    
    return this.api.getProcess(namespace, resource.name).then((response) => {
      //process can not be updated
    }).catch((error) => {
      return this.api.addProcess(namespace, resource);  
    })
  }
}
