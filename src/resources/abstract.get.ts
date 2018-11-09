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

export const tableConfig = {
  border: getBorderCharacters('ramac'),
  columns: {
    0: {
      name: 'tes',
      alignment: 'left',
      width: 50,
    },
    1: {
      alignment: 'left',
      width: 20,
    },
    2: {
      alignment: 'left',
      width: 30,
    },
    3: {
      alignment: 'left',
      width: 40,
    },
  },
  columnCount: 4,
  columnDefault: {
    width: 40,
  },
};

/**
 * Get resources
 */
export default abstract class AbstractGet extends AbstractOperation {
  protected optparse: Command<GetOptions, GetArgs>;
  protected client: TubeeClient;

  /**
   * Construct
   */
  constructor(optparse: Command<GetOptions, GetArgs>, client: TubeeClient) {
    super();
    this.optparse = optparse;
    this.client = client;
  }

  /**
   * Execute
   */
  public async getObjects(response, opts, fields = ['Name', 'Version', 'Changed', 'Created'], callback = null) {
    var body: string;
    switch (opts.output[0]) {
      case 'json':
        body = JSON.stringify(response.response.toJSON().body, null, 2);
        console.log(body);
        break;
      case 'yaml':
        body = yaml.dump(response.response.toJSON().body);
        console.log(body);
        break;
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

        console.log(table(data, tableConfig));
    }
  }

  /**
   * Realtime updates
   */
  public async watchObjects(request, opts, fields = ['Name', 'Version', 'Changed', 'Created'], callback = null) {
    var stream = createStream(tableConfig);
    stream.write(fields.map(x => colors.bold(x)));

    if (callback === null) {
      callback = resource => {
        return [resource.name, resource.version, ta.ago(resource.changed), ta.ago(resource.created)];
      };
    }

    request.pipe(JSONStream.parse('*')).pipe(
      es.mapSync(function(data) {
        switch (opts.output[0]) {
          case 'json':
            console.log(JSON.stringify(data, null, 2));
            break;
          case 'yaml':
            console.log(yaml.dump(data));
            console.log('---');
          case 'list':
          default:
            stream.write([data[1].name, data[1].version, ta.ago(data[1].changed), ta.ago(data[1].created)]);
        }
      }),
    );
  }
}
