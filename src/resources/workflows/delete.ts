import { Command } from 'commandpost';
import TubeeClient from '../../tubee.client';
import { DeleteOptions, DeleteArgs } from '../../operations/delete';
import AbstractDelete from '../abstract.delete';

/**
 * Delete resources
 */
export default class Delete extends AbstractDelete {
  /**
   * Apply cli options
   */
  public static applyOptions(optparse: Command<DeleteOptions, DeleteArgs>, client: TubeeClient) {
    return optparse
      .subCommand<DeleteOptions, DeleteArgs>('workflows <collection> <endpoint> <name>')
      .alias('wf')
      .description('Delete workflow')
      .action(async (opts, args, rest) => {
        var api = await client.factory('v1', optparse.parent.parsedOpts);
        var instance = new Delete(api);
        instance.execute(opts, args, rest);
      });
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    this.api.deleteWorkflow(this.getNamespace(opts), args.collection, args.endpoint, args.name);
    console.log('resource %s has been deleted', args.name);
  }
}
