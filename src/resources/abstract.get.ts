import { Command } from 'commandpost';
import { GetOptions, GetArgs } from '../operations/get';
import TubeeClient from '../tubee.client';
const yaml = require('js-yaml');
import { table, getBorderCharacters, createStream } from 'table';
const JSONStream = require('JSONStream');
const es = require('event-stream');
import AbstractOperation from './abstract.operation';
const ta = require('time-ago');
const colors = require('colors');
const fs = require('fs');
const os = require('os');
const fspath = require('path');
const difftool = process.env.DIFFTOOL || 'diff';
const child_process = require('child_process');
const randomstring = require('randomstring');
const objectPath = require('object-path');

export const tableConfig = {
  border: getBorderCharacters('ramac'),
  columnCount: 4,
  columnDefault: {
    width: 25,
  },
};

/**
 * Get resources
 */
export default abstract class AbstractGet extends AbstractOperation {
  protected api;
  protected children = [];
  protected names = [];

  /**
   * Construct
   */
  constructor(api) {
    super();
    this.api = api;
  }

  /**
   * Execute
   */
  public async getObjects(response, args, opts, fields = ['Name', 'Version', 'Changed', 'Created'], callback = null) {
    if (opts.logs && opts.logs.length > 0 && opts.output.length === 0 && args.name !== undefined) {
      opts.output.push('log');
    }

    if (opts.watch) {
      return this.watchObjects(response, opts, fields, callback);
    }

    if (opts.stream) {
      return this.streamObjects(response, opts, fields, callback);
    }

    if (opts.diff && opts.diff.length > 0) {
      return this.compare(response.response.toJSON().body, opts);
    }

    var output;
    if (opts.output[0]) {
      output = opts.output[0].split('=')[0];
    } else {
      output = opts.output[0];
    }

    var resource = response.response.toJSON().body;

    if(opts.recursive === true) {
      for(let sub of resource.data) {
        this.recursive(sub, opts, args);
      }

      this.names.push('all');
      var result = this.names.filter(value => -1 !== opts.whitelist.indexOf(value));
      if(result.length === 0) {
        return;
      }
    }

    var body: string;
    switch (output) {
      case 'json':
        body = JSON.stringify(resource, null, 2);
        console.log(body);
        break;
      case 'yaml':
        body = yaml.dump(resource);
        console.log(body);

        if(opts.recursive === true) {
          console.log('---');
        }

        break;
        case 'log':
        for (let resource of response.response.body.data) {
          this.drawLogLine(resource, opts);
        }

        if(resource.count < resource.total) {
          console.log('# %s of %s total resources. Specify a query or use --stream to display more resources.', resource.count, resource.total);
        }

        break;
      case 'cc':
        fields = [];
        var values = [];
        var cols = opts.output[0].split('=')[1];

        for (let col of cols.split(',')) {
          fields.push(col.split(':')[0]);
          values.push(col.split(':')[1]);
        }

        callback = resource => {
          var result = [];
          for (let value of values) {
            value = objectPath.get(resource, value);
            if (value === undefined) {
              result.push('<none>');
            } else {
              result.push(value);
            }
          }

          return result;
        };

      case 'list':
      default:
        if (callback === null) {
          callback = resource => {
            return [resource.name, resource.version, ta.ago(resource.changed), ta.ago(resource.created)];
          };
        }

        var data = [];
        data.push(fields.map(x => colors.bold(x)));

        if (response.response.body.kind === 'List') {
          for (let resource of response.response.body.data) {
            data.push(callback(resource));
          }
        } else {
          let resource = response.response.body;
          data.push(callback(resource));
        }

        if (data.length === 1) {
          console.log('It is empty here. Either create new resources or change your query.');
        } else {
          console.log(table(data, tableConfig));

          if(resource.count < resource.total) {
            console.log('# %s of %s total resources. Specify a query or use --stream to display more resources.', resource.count, resource.total);
          }
        }
    }
  }

  /**
   * Get recursive resources
   */
  public async recursive(resource, opts, args) {
  }

  /**
   * Start difftool
   */
  protected async compare(objects, opts) {
    var result = null;
    for (let resource of objects.data) {
      if (resource.version == opts.diff[0]) {
        result = resource;
      }
    }

    var current = objects.data.shift();
    var path1: string = this.createDiffFile(current, opts);
    let last = current.version - 1;

    if (opts.diff[0] !== '') {
      last = opts.diff[0];
    }

    for (let resource of objects.data) {
      if (resource.version == last) {
        result = resource;
      }
    }

    if (result === null) {
      console.log('No version %s found in resource history', opts.diff[0]);
    }

    var path2: string = this.createDiffFile(result, opts);
    var child = child_process.spawn(difftool, [path1, path2], {
      stdio: 'inherit',
    });
  }

  /**
   * Prepare resource to diff
   */
  protected createDiffFile(resource, opts) {
    var body: string;
    switch (opts.output[0]) {
      case 'json':
        body = JSON.stringify(resource, null, 2);
        break;
      case 'yaml':
      default:
        body = yaml.dump(resource);
        break;
    }

    var path: string = fspath.join(os.tmpdir(), '.' + randomstring.generate(7) + '.' + (opts.output[0] || 'yml'));

    fs.writeFileSync(path, body);
    return path;
  }

  /**
   * Display stream
   */
  public async streamObjects(request, opts, fields = ['Name', 'Version', 'Changed', 'Created'], callback = null) {
    var config = tableConfig;
    config.columnCount = fields.length;

    if (!opts.output[0] || opts.output[0] === 'list') {
      var stream = createStream(config);
      stream.write(fields.map(x => colors.bold(x)));
    }

    if (callback === null) {
      callback = resource => {
        return [resource.name, resource.version, ta.ago(resource.changed), ta.ago(resource.created)];
      };
    }

    var that = this;
    request.pipe(JSONStream.parse('*')).pipe(
      es.mapSync(function(data) {
        switch (opts.output[0]) {
          case 'json':
            console.log(JSON.stringify(data, null, 2));
            break;
          case 'yaml':
            console.log(yaml.dump(data));
            console.log('---');
            break;
          case 'log':
            that.drawLogLine(data, opts);
            break;
          case 'list':
          default:
            stream.write(callback(data));
        }
      }),
    );
  }

  /**
   * Realtime updates
   */
  public async watchObjects(request, opts, fields = ['Name', 'Version', 'Changed', 'Created'], callback = null) {
    var config = tableConfig;
    config.columnCount = fields.length;

    if (!opts.output[0] || opts.output[0] === 'list') {
      var stream = createStream(config);
      stream.write(fields.map(x => colors.bold(x)));
    }

    if (callback === null) {
      callback = resource => {
        return [resource.name, resource.version, ta.ago(resource.changed), ta.ago(resource.created)];
      };
    }

    var that = this;
    request.pipe(process.stdout).pipe(JSONStream.parse('*')).pipe(
      es.mapSync(function(data) {
        switch (opts.output[0]) {
          case 'json':
            console.log(JSON.stringify(data, null, 2));
            break;
          case 'yaml':
            console.log(yaml.dump(data));
            console.log('---');
            break;
          case 'log':
            that.drawLogLine(data[1], opts);
            break;
          case 'list':
          default:
            stream.write(callback(data[1]));
        }
      }),
    );
  }

  /**
   * Stream
   */
  public async drawLogLine(data, opts) {
    console.log('%s %s %s', data.created, AbstractGet.colorize(data.data.level_name), data.data.message);

    if (data.data.exception && (opts.trace.length > 0 || opts.trace === true)) {
      var e = data.data.exception;
      var line = e.class + ': ' + e.message + ' in ' + e.file + ' stacktrace: ' + e.trace;
      console.log(line);
    }
  }

  /**
   * Colorize log level
   */
  public static colorize(status): string {
    switch (status) {
      case 'DEBUG':
        return colors.bgBlue(status);
        break;
      case 'INFO':
        return colors.bgCyan(status);
        break;
      case 'WARNING':
        return colors.bgYellow(status);
        break;
      case 'ERROR':
      default:
        return colors.bgRed(status);
    }
  }
}
