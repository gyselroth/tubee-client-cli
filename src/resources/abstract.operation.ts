import { ConfigStore } from '../config';

/**
 * Abstract
 */
export default abstract class AbstractOperation {
  /**
   * Execute operation
   */
  protected static executeOperation(operation) {
    operation.catch(e => {
console.log(e);
      if (e.response.statusCode === 404) {
        console.log('No such resource found.');
      } else {
        console.log('Invalid resource request.');
      }
    });
  }

  /**
   * Create query
   */
  protected createQuery(opts, args) {
    var query = null;

    if (opts.jsonQuery[0]) {
      return opts.jsonQuery[0];
    }

    if (opts.fieldSelector) {
      query = {};
      for (let selector of opts.fieldSelector) {
        for (let field of selector.split(',')) {
          var result;
          if ((result = field.match('^([^!=]+)=([^!=]+)'))) {
            query[result[1]] = result[2];
          } else if ((result = field.match('^([^!=]+)!=([^!=]+)'))) {
            query[result[1]] = result[2];
          }
        }
      }

      query = JSON.stringify(query);
    }

    return query;
  }

  protected getNamespace(opts): string {
    if (opts.namespace[0]) {
      return opts.namespace[0];
    } else if (ConfigStore.get().defaultNamespace) {
      return ConfigStore.get().defaultNamespace;
    } else {
      return 'default';
    }
  }

  /**
   * Get query options
   */
  protected getQueryOptions(opts, args): string[] {
    return [
      this.createQuery(opts, args),
      this.getFields(opts),
      this.getOffset(opts),
      this.getLimit(opts),
      this.getSort(opts),
      this.getStream(opts),
      this.getWatch(opts),
    ];
  }

  /**
   * Get watch
   */
  protected getWatch(opts): boolean {
    return opts.watch;
  }

  /**
   * Get stream
   */
  protected getStream(opts): boolean {
    return opts.stream;
  }

  /**
   * Get offset
   */
  protected getOffset(opts): number {
    if (opts.tail[0]) {
      return opts.tail[0] * -1;
    } else {
      return 0;
    }
  }

  /**
   * Get limit
   */
  protected getLimit(opts): number {
    if (opts.limit[0]) {
      if (opts.limit[0] > 100) {
        return 100;
      }

      return opts.limit[0];
    } else if (opts.stream) {
      return 0;
    }

    return 100;
  }

  /**
   * Get fields
   */
  protected getFields(opts) {
    return [];
  }

  /**
   * Get sort
   */
  protected getSort(opts) {
    var sort = null;

    if (opts.jsonSort[0]) {
      return opts.jsonSort[0];
    }

    if (opts.tail[0]) {
      return JSON.stringify({
        $natural: 1,
      });
    }

    if (opts.sort) {
      sort = {};
      for (let selector of opts.sort) {
        for (let field of selector.split(',')) {
          var result;
          if ((result = field.match('^([^=]+)=asc'))) {
            sort[result[1]] = 1;
          } else if ((result = field.match('^([^=]+)=desc'))) {
            sort[result[1]] = -1;
          } else {
            sort[field] = -1;
          }
        }
      }

      sort = JSON.stringify(sort);
    }

    return sort;
  }
}
