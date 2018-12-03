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
      .subCommand<EditOptions, EditArgs>('relations [namespace] [collection] [name]')
      .alias('re')
      .description('Edit data object relations')
      .action(async (opts, args, rest) => {
        var api = await client.factory('DataObjectRelations', optparse.parent.parsedOpts);
        var instance = new Edit(api);
        instance.execute(opts, args, rest);
      });
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    if (args.name) {
      var response = await this.api.getObjectRelative(
        args.namespace,
        args.collection,
        args.object,
        args.name,
        this.getFields(opts),
      );
    } else {
      var response = await this.api.getObjectRelatives(
        args.namespace,
        args.collection,
        args.object,
        this.getQueryOptions(opts, args),
      );
    }

    this.editObjects(response, opts, async (name, patch) => {
      return await this.api.updateObjectRelative(args.namespace, args.collection, args.object, name, patch);
    });
  }
}
