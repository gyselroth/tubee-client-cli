import { Command } from 'commandpost';
import { SyncOptions, SyncArgs } from '../operations/sync';
import TubeeClient from '../tubee.client';
const JSONStream = require('JSONStream');
const es = require('event-stream');
import Log from './logs/get';

/**
 * Sync resources
 */
export default abstract class AbstractSync {
  protected optparse: Command<SyncOptions, SyncArgs>;
  protected client: TubeeClient;

  /**
   * Construct
   */
  constructor(optparse: Command<SyncOptions, SyncArgs>, client: TubeeClient) {
    this.optparse = optparse;
    this.client = client;
  }

  /**
   * Add process
   */
  protected async addProcess(resource, opts, args, rest) {
    var api = await this.client.factory('Jobs', this.optparse.parent.parsedOpts);
    //resource.data.loadbalance = false;
    resource.data.ignore = !opts.abortOnError;
    resource.data.log_level = opts.level[0];
    var result = await api.addProcess(resource);
    this.sync(result, opts);
  }

  /**
   * Follow log stream if requested
   */
  protected async sync(result, opts: SyncOptions) {
    console.log('created new process %s', result.body.id);

    if (opts.follow) {
      console.log('\n');
      var api = await this.client.factory('Jobs', this.optparse.parent.parsedOpts);
      var request = api.watchProcessLogs(result.body.id);
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
          Log.colorize(data[1].data.level_name),
          data[1].data.category,
          data[1].data.message,
        );
      }),
    );
  }
}
