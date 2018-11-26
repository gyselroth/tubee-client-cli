import { EditOptions, EditArgs } from '../../operations/edit';
import AbstractEdit from '../abstract.edit';

/**
 * Edit resources
 */
export default class Edit extends AbstractEdit {
  /**
   * Apply cli options
   */
  public applyOptions() {
    return this.optparse
      .subCommand<EditOptions, EditArgs>('collections <namespace> [name]')
      .alias('co')
      .description('Edit collection')
      .action(this.execute.bind(this));
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    var api = await this.client.factory('Collections', this.optparse.parent.parsedOpts);

    if (args.name) {
      var response = await api.getCollection(args.namespace, args.name, this.getFields(opts));
    } else {
      var response = await api.getCollections(args.namespace, ...this.getQueryOptions(opts, args));
    }

    this.editObjects(response, opts, async (name, patch) => {
      return await api.updateCollection(args.namespace, name, patch);
    });
  }
}
