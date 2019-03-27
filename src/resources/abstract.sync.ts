import { Command } from 'commandpost';
import { SyncOptions, SyncArgs } from '../operations/sync';
import TubeeClient from '../tubee.client';
const JSONStream = require('JSONStream');
const es = require('event-stream');
import AbstractOperation from './abstract.operation';
import AbstractGet from './abstract.get';

/**
 * Sync resources
 */
export default abstract class AbstractSync extends AbstractGet {
  /**
   * Add process
   */
  protected async addProcess(namespace, resource, opts, args, rest) {
    resource.data.ignore = !opts.abortOnError;
    resource.data.log_level = opts.level[0];
    resource.data.simulate = opts.simulate;
    return this.api.addProcess(namespace, resource).then(result => {
      this.sync(result, opts);
    });
  }

  /**
   * Follow log stream if requested
   */
  protected async sync(result, opts) {
    console.log('created new process %s', result.body.id);

    if (opts.follow) {
      console.log('\n');
      if (opts.output.length === 0) {
        opts.output.push('log');
      }

      var request = this.api.getProcessLogs(
        result.body.namespace,
        result.body.id,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        true,
        true,
      );
      this.watchObjects(request, opts);
    }
  }
}
