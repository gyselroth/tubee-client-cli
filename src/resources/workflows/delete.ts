import { DeleteOptions, DeleteArgs } from '../../operations/delete';
import AbstractDelete from '../abstract.delete';

/**
 * Delete resources
 */
export default class Delete extends AbstractDelete {
  /**
   * Apply cli options
   */
  public applyOptions() {
    return this.optparse
      .subCommand<DeleteOptions, DeleteArgs>('workflows <mandator> <datatype> <endpoint> <name>')
      .description('Delete workflow')
      .action(this.execute.bind(this));
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    var api = await this.client.factory('Workflows', this.optparse.parent.parsedOpts);
    var re = await api.deleteWorkflow(args.mandator, args.datatype, args.endpoint, args.name);
    console.log(re);
    console.log('resource %s has been deleted', args.name);
  }
}
