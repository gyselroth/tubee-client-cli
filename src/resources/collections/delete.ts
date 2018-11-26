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
      .subCommand<DeleteOptions, DeleteArgs>('collections <name>')
      .alias('co')
      .description('Delete collection')
      .action(this.execute.bind(this));
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    var api = await this.client.factory('Collections', this.optparse.parent.parsedOpts);
    await api.deleteCollection(args.namespace, args.name);
    console.log('resource %s has been deleted', args.name);
  }
}
