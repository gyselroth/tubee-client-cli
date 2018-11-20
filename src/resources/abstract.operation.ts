/**
 * Abstract
 */
export default abstract class AbstractOperation {
  /**
   * Create query
   */
  protected createQuery(opts, args) {
    var query = null;

    if (opts.watch && args.name) {
      return JSON.stringify({ name: args.name });
    }

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
    ];
  }

  /**
   * Get offset
   */
  protected getOffset(opts) {
    var query = null;
    if (opts.tail) {
      return opts.tail[0] * -1;
    } else {
      return 0;
    }
  }

  /**
   * Get limit
   */
  protected getLimit(opts) {
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
