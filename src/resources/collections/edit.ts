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
      .subCommand<EditOptions, EditArgs>('collections [name]')
      .alias('co')
      .description('Edit collections')
      .action(async (opts, args, rest) => {
        var api = await client.factory('v1', optparse.parent.parsedOpts);
        var instance = new Edit(api);
        this.executeOperation(instance.execute(opts, args, rest));
      });
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    if (args.name) {
      var response = await this.api.getCollection(this.getNamespace(opts), args.name, this.getFields(opts));
    } else {
      var response = await this.api.getCollections(this.getNamespace(opts), ...this.getQueryOptions(opts, args));
    }

    this.editObjects(response, opts, async (name, patch) => {
      return await this.api.updateCollection(this.getNamespace(opts), name, patch);
    });
  }
}
