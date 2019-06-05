import { Command } from 'commandpost';
import TubeeClient from '../../tubee.client';
import { GetOptions, GetArgs } from '../../operations/get';
import AbstractGet from '../abstract.get';

/**
 * Get resoures
 */
export default class Get extends AbstractGet {
  /**
   * Names
   */
  protected names = ['workflows', 'wf'];

  /**
   * Apply cli options
   */
  public static applyOptions(optparse: Command<GetOptions, GetArgs>, client: TubeeClient) {
    return optparse
      .subCommand<GetOptions, GetArgs>('workflows <collection> <endpoint> [name]')
      .alias('wf')
      .description('Get workflows')
      .action(async (opts, args, rest) => {
        var api = await client.factory('v1', optparse.parent.parsedOpts);
        var instance = new Get(api);
        this.executeOperation(instance.execute(opts, args, rest));
      });
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    if (args.name) {
      var response = await this.api.getWorkflow(
        this.getNamespace(opts),
        args.collection,
        args.endpoint,
        args.name,
        this.getFields(opts),
      );

      this.getObjects(response, args, opts);
    } else {
      var response = await this.api.getWorkflows(
        this.getNamespace(opts),
        args.collection,
        args.endpoint,
        ...this.getQueryOptions(opts, args),
      );
      this.getObjects(response, args, opts);
    }
  }
}
