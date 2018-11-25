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
      .subCommand<EditOptions, EditArgs>('workflows <namespace> <collection> <endpoint> [name]')
      .alias('wf')
      .description('Edit workflows')
      .action(this.execute.bind(this));
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    var api = await this.client.factory('Workflows', this.optparse.parent.parsedOpts);

    if (args.name) {
      var response = await api.getWorkflow(
        args.namespace,
        args.collection,
        args.endpoint,
        args.name,
        this.getFields(opts),
      );
    } else {
      var response = await api.getWorkflows(
        args.namespace,
        args.collection,
        args.endpoint,
        ...this.getQueryOptions(opts, args),
      );
    }

    this.editObjects(response, opts, async (name, patch) => {
      return await api.updateWorkflow(args.namespace, args.collection, args.endpoint, name, patch);
    });
  }
}
