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
    var update = false;
    var namespace = resource.namespace;
    delete resource.namespace;

    return this.api
      .getSecret(namespace, resource.name)
      .then((response) => {
        update = true;
        let to = resource;
        let from = response.response.toJSON().body;
        let patch = jsonpatch.compare(from, to);
        return this.api.updateSecret(namespace, resource.name, patch);
      })
      .catch((error) => {
        if (update === true) {
          throw error;
        }

        return this.api.addSecret(namespace, resource);
      });
  }
}
