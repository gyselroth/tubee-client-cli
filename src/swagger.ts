const merge = require('lodash.merge');

/**
 * Merge allOf OpenAPI definitions
 */
export function mergeAllOf(definition) {
  if (!definition.allOf) {
    return definition;
  }

  var result = {};
  for (let resource of definition.allOf) {
    if (resource.allOf) {
      result = merge(result, mergeAllOf(resource));
    } else {
      result = merge(result, resource);
    }
  }

  return result;
}
