import { GetOptions, GetArgs } from '../../operations/get';
import AbstractGet from '../abstract.get';

/**
 *  * Edit resources
 *   */
export default class Get extends AbstractGet {
  /**
   * Apply cli options
   */
  public applyOptions() {
    return this.optparse
      .subCommand<GetOptions, GetArgs>('workflows <mandator> <datatype> <endpoint> [name]')
      .alias('wf')
      .description('Get workflows')
      .action(this.execute.bind(this));
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    var category = await this.client.factory('Workflows', this.optparse.parent.parsedOpts);

    if (opts.watch) {
      if (args.name) {
        var request = category.watchWorkflows(
          args.mandator,
          args.datatype,
          args.endpoint,
          ...this.getQueryOptions(opts, args),
        );
        this.watchObjects(request, opts);
      } else {
        var request = category.watchWorkflows(
          args.mandator,
          args.datatype,
          args.endpoint,
          ...this.getQueryOptions(opts, args),
        );
        this.watchObjects(request, opts);
      }
    } else {
      if (args.name) {
        var response = await category.getWorkflow(
          args.mandator,
          args.datatype,
          args.endpoint,
          args.name,
          this.getFields(opts),
        );
        this.getObjects(response, opts);
      } else {
        var response = await category.getWorkflows(
          args.mandator,
          args.datatype,
          args.endpoint,
          ...this.getQueryOptions(opts, args),
        );
        this.getObjects(response, opts);
      }
    }
  }
}
