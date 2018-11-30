import { Command } from 'commandpost';
import TubeeClient from '../../tubee.client';
import { EditOptions, EditArgs } from '../../operations/edit';
import AbstractEdit from '../abstract.edit';

/**
 * Edit resources
 */
export default class Edit extends AbstractEdit {
  /**
   * Apply cli options
   */
  public static applyOptions(optparse: Command<EditOptions, EditArgs>, client: TubeeClient) {
    return optparse
      .subCommand<EditOptions, EditArgs>('endpoints <namespace> <collection> [name]')
      .alias('ep')
      .description('edit endpoints')
      .action(async (opts, args, rest) => {
        var api = await client.factory('Endpoints', optparse.parent.parsedOpts);
        var instance = new Edit(api);
        instance.execute(opts, args, rest);
      });
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    if (args.name) {
      var response = await this.api.getEndpoint(args.namespace, args.collection, args.name, this.getFields(opts));
    } else {
      var response = await this.api.getEndpoints(args.namespace, args.collection, ...this.getQueryOptions(opts, args));
    }

    this.editObjects(response, opts, async (name, patch) => {
      return await this.api.updateEndpoint(args.namespace, args.collection, name, patch);
    });
  }
}
