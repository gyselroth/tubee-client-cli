import { Command } from 'commandpost';
import { SyncOptions, SyncArgs } from '../operations/sync';
import TubeeClient from '../tubee.client';
const JSONStream = require('JSONStream');
const es = require('event-stream');
import ProcessLog from './process-logs/get';

/**
 * Sync resources
 */
export default abstract class AbstractSync {
  protected api;

  /**
   * Construct
   */
  constructor(api) {
    this.api = api;
  }

  /**
   * Add process
   */
  protected async addProcess(namespace, resource, opts, args, rest) {
    resource.data.ignore = !opts.abortOnError;
    resource.data.log_level = opts.level[0];
    resource.data.simulate = opts.simulate;
    var result = await this.api.addProcess(namespace, resource);
    this.sync(result, opts);
  }

  /**
   * Follow log stream if requested
   */
  protected async sync(result, opts: SyncOptions) {
    console.log('created new process %s', result.body.id);
    
    if (opts.follow) {
      console.log('\n');
      var request = this.api.watchProcessLogs(result.body.namespace, result.body.id);
      this.watchObjects(request, opts);
    }
  }

  /**
   * Realtime updates
   */
  public async watchObjects(request, opts) {
    return request.pipe(JSONStream.parse('*')).pipe(
      es.mapSync(data => {
        console.log(
          '%s %s %s',
          data[1].created,
          ProcessLog.colorize(data[1].data.level_name),
          data[1].data.category,
          data[1].data.message,
        );
      }),
    );
  }
}
