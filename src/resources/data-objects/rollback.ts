import { Command } from 'commandpost';
import TubeeClient from '../../tubee.client';
import { RollbackOptions, RollbackArgs } from '../../operations/rollback';
import AbstractRollback from '../abstract.rollback';

/**
 * Rollback resources
 */
export default class Rollback extends AbstractRollback {
  /**
   * Apply cli options
   */
  public static applyOptions(optparse: Command<RollbackOptions, RollbackArgs>, client: TubeeClient) {
    return optparse
      .subCommand<RollbackOptions, RollbackArgs>('data-objects <collection> <name>')
      .alias('do')
      .description('Rollback data objects')
      .action(async (opts, args, rest) => {
        var api = await client.factory('v1', optparse.parent.parsedOpts);
        var instance = new Rollback(api);
        this.executeOperation(instance.execute(opts, args, rest));
      });
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    var response = await this.api.getObjectHistory(
      this.getNamespace(opts),
      args.collection,
      args.name,
      ...this.getQueryOptions(opts, args),
    );

    this.rollbackObject(response, opts, async (name, patch) => {
      return await this.api.updateObject(this.getNamespace(opts), args.collection, name, patch);
    });
  }
}
