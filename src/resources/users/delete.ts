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
      .subCommand<DeleteOptions, DeleteArgs>('users <name>')
      .alias('ar')
      .description('Delete user')
      .action(async (opts, args, rest) => {
        var api = await client.factory('Users', optparse.parent.parsedOpts);
        var instance = new Delete(api);
        instance.execute(opts, args, rest);
      });
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    await this.api.deleteUser(args.name);
    console.log('resource %s has been deleted', args.name);
  }
}
