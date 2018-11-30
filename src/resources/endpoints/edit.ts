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
      .subCommand<EditOptions, EditArgs>('endpoints <namespace> <collection> [name]')
      .alias('ep')
      .description('Edit endpoints')
      .action(this.execute.bind(this));
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    var api = await this.client.factory('Endpoints', this.optparse.parent.parsedOpts);

    if (args.name) {
      var response = await api.getEndpoint(args.namespace, args.collection, args.name, this.getFields(opts));
    } else {
      var response = await api.getEndpoints(args.namespace, args.collection, ...this.getQueryOptions(opts, args));
    }

    this.editObjects(response, opts, async (name, patch) => {
      return await api.updateEndpoint(args.namespace, args.collection, name, patch);
    });
  }
}
