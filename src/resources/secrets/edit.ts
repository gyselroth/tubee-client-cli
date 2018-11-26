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
      .subCommand<EditOptions, EditArgs>('secrets [name]')
      .alias('ar')
      .description('Edit secrets')
      .action(this.execute.bind(this));
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    var api = await this.client.factory('Secrets', this.optparse.parent.parsedOpts);

    if (args.name) {
      var response = await api.getSecret(args.name, this.getFields(opts));
    } else {
      var response = await api.getSecrets(...this.getQueryOptions(opts, args));
    }

    this.editObjects(response, opts, async (name, patch) => {
      return await api.updateSecret(name, patch);
    });
  }
}
