import { ConfigStore } from '../config';

/**
 * Abstract
 */
export default abstract class AbstractOperation {
  /**
   * Execute operation
   */
  protected static executeOperation(operation) {
    operation.catch((e) => {
      if (e.response && e.response.statusCode === 404) {
        console.log('No such resource found.');
      } else if (e.response) {
        console.log('Invalid resource request.');
      } else {
        console.log('Error: %s', e.message);
      }
    });
  }

  /**
   * Create query
   */
  protected createQuery(opts, args) {
    var query = null;

    if (opts.jsonQuery && opts.jsonQuery[0]) {
      return opts.jsonQuery[0];
    }

    if (opts.fieldSelector) {
      query = {};
      for (let selector of opts.fieldSelector) {
        for (let field of selector.split(',')) {
          var result;
          if ((result = field.match('^([^!=]+)=([^!=]+)'))) {
            query[result[1]] = this.parseValue(result[2]);
          } else if ((result = field.match('^([^!=]+)!=([^!=]+)'))) {
            query[result[1]] = this.parseValue(result[2]);
          } else if ((result = field.match('^([^!=]+)<([^!=]+)'))) {
            query[result[1]] = { $lt: this.parseValue(result[2]) };
          } else if ((result = field.match('^([^!=]+)<=([^!=]+)'))) {
            query[result[1]] = { $lte: this.parseValue(result[2]) };
          } else if ((result = field.match('^([^!=]+)>([^!=]+)'))) {
            query[result[1]] = { $gt: this.parseValue(result[2]) };
          } else if ((result = field.match('^([^!=]+)>=([^!=]+)'))) {
            query[result[1]] = { $gte: this.parseValue(result[2]) };
          }
        }
      }

      query = JSON.stringify(query);
    }

    return query;
  }

  /**
   * parse string value to something more meaningful
   */
  protected parseValue(value) {
    if (value.match('^[0-9]+$')) {
      return parseInt(value);
    }

    return value;
  }

  /**
   * Get namespace
   */
  public getNamespace(opts): string {
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
    return 0;
  }

  /**
   * Get limit
   */
  protected getLimit(opts): number {
    if (opts.tail && opts.tail[0]) {
      return opts.tail[0];
    } else if (opts.limit && opts.limit[0]) {
      if (opts.limit[0] > 100) {
        return 100;
      }

      return opts.limit[0];
    } else if (opts.stream) {
      return 0;
    }

    return 20;
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

    if (opts.jsonSort && opts.jsonSort[0]) {
      return opts.jsonSort[0];
    }

    if (opts.tail && opts.tail.length === 1) {
      return JSON.stringify({ changed: -1 });
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
