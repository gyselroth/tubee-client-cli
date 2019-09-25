import { Command } from 'commandpost';
import { SyncOptions, SyncArgs } from '../operations/sync';
import TubeeClient from '../tubee.client';
const JSONStream = require('JSONStream');
const es = require('event-stream');
const util = require('util');
import AbstractOperation from './abstract.operation';
import AbstractGet from './abstract.get';
import ProcessGet from './processes/get';

/**
 * Sync resources
 */
export default abstract class AbstractSync extends AbstractGet {
  /**
   * Add process
   */
  protected async addProcess(namespace, resource, opts, args, rest) {
    if (resource.data.ignore === undefined) {
      resource.data.ignore = !opts.abortOnError;
    }

    if (resource.data.log_level === undefined) {
      resource.data.log_level = opts.level[0];
    }

    if (resource.data.simulate === undefined) {
      resource.data.simulate = opts.simulate;
    }

    resource.data.filter = this.createQuery(opts, args);

    return this.api.addProcess(namespace, resource).then(result => {
      this.sync(result, opts, namespace);
    });
  }

  /**
   * Follow log stream if requested
   */
  protected async sync(result, opts, namespace) {
    process.stdout.write(
      util.format(
        '%s process %s is now %s\n',
        new Date().toISOString(),
        result.body.id,
        ProcessGet.colorize({ code: 0, result: 'waiting' }),
      ),
    );

    var processUpdates = this.api.getProcesses(
      namespace,
      JSON.stringify({ _id: { $oid: result.body.id } }),
      [],
      0,
      0,
      '{}',
      false,
      true,
    );
    processUpdates.pipe(JSONStream.parse('*')).pipe(
      es.mapSync(function(data) {
        process.stdout.write(
          util.format(
            '%s process %s is now %s\n',
            new Date().toISOString(),
            result.body.id,
            ProcessGet.colorize(data[1].status),
          ),
        );

        if (data[1].status.code > 2) {
          process.exit();
        }
      }),
    );

    if (opts.follow || opts.trace) {
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
