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
      .subCommand<EditOptions, EditArgs>('users [name]')
      .alias('ar')
      .description('Edit users')
      .action(this.execute.bind(this));
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    var api = await this.client.factory('Users', this.optparse.parent.parsedOpts);

    if (args.name) {
      var response = await api.getUser(args.name, this.getFields(opts));
    } else {
      var response = await api.getUsers(...this.getQueryOptions(opts, args));
    }

    this.editObjects(response, opts, async (name, patch) => {
      return await api.updateUser(name, patch);
    });
  }
}
