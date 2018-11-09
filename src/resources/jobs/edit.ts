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
      .subCommand<EditOptions, EditArgs>('jobs [name]')
      .description('Edit synchronization job')
      .option('--force-trigger', 'Create a new process for a job by force (Ignore scheduled datetime for the job)')
      .action(this.execute.bind(this));
  }

  /**
   * Execute
   */
  public async execute(opts, args, rest) {
    var api = await this.client.factory('Jobs', this.optparse.parent.parsedOpts);

    if (args.name) {
      var response = await api.getJob(args.name, this.getFields(opts));
    } else {
      var response = await api.getJobs(...this.getQueryOptions(opts, args));
    }

    await this.editObjects(response, opts, async (name, patch) => {
      var result = await api.updateJob(name, patch);
      console.log('Edited job %s successfully.', name);

      if (opts.forceTrigger) {
        var result = await api.triggerProcess(name);
        console.log('Created process %s for job %s', result.body.name, name);
      }

      return result;
    });
  }
}
