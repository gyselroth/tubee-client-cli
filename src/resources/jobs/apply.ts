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

    return this.api.getJob(namespace, resource.name).then((response) => {
      let to = resource;
      let from = response.response.toJSON().body;
      let patch = jsonpatch.compare(to, from);
      return this.api.updateJob(namespace, resource.name, patch);  
    }).catch((error) => {
      return this.api.addJob(namespace, resource);  
    })
  }
}
