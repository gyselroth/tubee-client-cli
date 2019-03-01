import { Command } from 'commandpost';
import { CreateOptions, CreateArgs } from '../operations/create';
import TubeeClient from '../tubee.client';
const yaml = require('js-yaml');
const fs = require('fs');
const editor = process.env.EDITOR || 'vim';
const child_process = require('child_process');
import AbstractOperation from './abstract.operation';
const SwaggerParser = require('swagger-parser');
const specPath = 'node_modules/@gyselroth/tubee-sdk-node/openapi.yml';
const randomstring = require('randomstring');
const os = require('os');
const fspath = require('path');
import { mergeAllOf } from '../swagger';
import {validate, identifierMap} from '../validator';

/**
 * Create resources
 */
export default abstract class AbstractCreate extends AbstractOperation {
  protected api;

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
  public async createObjects(resourceType, resources, opts, callback) {
    var body: string = '';
    var path: string;

    if(opts.file[0]) {
      return this.openEditor(opts.file[0], opts.input[0]);
    } else if (opts.stdin) {
      var content: string = '';
      process.stdin.resume();
      var reader = function(buf) {
        content += buf.toString();
      };
      process.stdin.on('data', reader);
      process.stdin.once('end', async () => {
        process.stdin.removeListener('data', reader);
        process.stdin.removeAllListeners('keypress');

        if (content === '') {
          return;
        }

        var path: string = fspath.join(os.tmpdir(), '.' + randomstring.generate(7) + '.yml');
        await fs.writeFile(path, content, function(err) {
          if (err) {
            return console.log(err);
          }
        });

        return this.openEditor(path, opts.input[0]);
      });
    } else if (opts.fromTemplate.length > 0) {
      var path: string = fspath.join(os.tmpdir(), '.' + randomstring.generate(7) + '.yml');

      if (opts.fromTemplate[0] !== '') {
        resourceType = opts.fromTemplate[0];
      }

      SwaggerParser.validate(specPath, async (err, api) => {
        if (err) {
          console.error('Failed to retrieve the resource specification', err);
        } else if (api.components.schemas[resourceType]) {
          for (let field in resources) {
            if (resources[field] != undefined) {
              body += field + ': ' + resources[field] + '\n';
            }
          }

          body += this.createTemplate(mergeAllOf(api.components.schemas[resourceType]).properties);
        }

        await fs.writeFile(path, body, function(err) {
          if (err) {
            return console.log(err);
          }
        });

        return this.openEditor(path, opts.input[0]);
      });
    } else {
      body += "kind: "+resourceType+'\n';

      for (let field in resources) {
        if (resources[field] != undefined) {
          body += field + ': ' + resources[field] + '\n';
        }
      }

      path = fspath.join(os.tmpdir(), '.' + randomstring.generate(7) + '.' + (opts.input[0] || 'yml'));
      await fs.writeFile(path, body, function(err) {
        if (err) {
          return console.log(err);
        }
      });

      return this.openEditor(path, opts.input[0]);
    }
  }

  /**
   * Create resource template from openapi specs
   */
  protected createTemplate(definition, depth = 0) {
    var body: string = '';

    for (let attr in definition) {
      if (definition[attr].type == 'object' && definition[attr].properties) {
        body +=
          ''.padStart(depth, ' ') +
          attr +
          ':\n';

        body += this.createTemplate(definition[attr].properties, depth + 2);
      } else {
        body +=
          ''.padStart(depth, ' ') +
          attr +
          ': ' +
          (this.quote(definition[attr], depth + 2)) +
          ' #<' +
          definition[attr].type +
          this.parseEnum(definition[attr]) +
          '> ' +
          definition[attr].description +
          '\n';
      }
    }

    return body;
  }

  /**
   * Quote string if required
   */
  protected quote(property, depth) {
    if(property.type === 'object') {
      return '{}';
    }

    if(property.default === undefined) {
      return null;
    }

    var value = property.default;

    if(typeof(value) == 'string') {
      if(value == '"' || value == '\\') {
        value = '\\'+value;
      }

      return '"'+value+'"';
    }

    if(typeof(value) == 'object' && value !== null && !(value instanceof Array)) {
        return "\n"+"".padStart(depth,  ' ')+yaml.dump(value).trim().replace(/\n/, '\n    ');
    }

    return JSON.stringify(value);
  }

  /**
   * Parse enum list
   */
  protected parseEnum(definition): string {
    if(definition.enum) {
      return ' ['+definition.enum.join(',')+']';
    }

    return '';
  }

  /**
   * Open editor to edit resources
   */
  protected async openEditor(path: string, input: string, existing?: string) {
    return new Promise(async (resolve, reject) => {
      var child = child_process.spawn(editor, [path], {
        stdio: 'inherit',
      });

      await child.on('exit', async (e, code) => {
        var body: string = fs.readFileSync(path, 'utf-8');
        var update;
        var new_hash: string;

        try {
          switch (input) {
            case 'json':
              update = JSON.parse(body);
              break;

            case 'yaml':
            default:
              update = yaml.safeLoad(body);
          }
          new_hash = JSON.stringify(update);

          await this.applyObjects(update).catch(response => {
            if (response.response) {
              var msg = '';
              if(response.response.body.more) {
                msg += yaml.dump(response.response.body.more).split('\n').map(s => `# ${s}`).join('\n');
              } else {
                msg = response.response.body.error + ' - ' + response.response.body.message;
              }

              throw new Error(msg);
            } else {
              throw response;
            }
          });

          resolve();
        } catch (error) {
          if (new_hash == existing) {
            console.log('Could not create resource %s', path);
            return;
          }

          body = '#' + error + '\n' + body;
          await fs.writeFile(path, body, function(err) {
            if (err) {
              return console.log(err);
            }
          });

          this.openEditor(path, input, new_hash);
        }
      });
    });
  }

  /**
   * Create
   */
  abstract async create(resource);

  /**
   * Update Objects
   */
  protected async applyObjects(update) {
    if (update instanceof Array) {
      for (let resource of update) {
        if(validate(resource) === false) {
          throw new Error('resource is not valid, identifiers missing '+JSON.stringify(identifierMap[resource.kind]));
        }

        let result = await this.create(resource);
        console.log('Created new resource %s', resource.name);
      }
    } else if (update instanceof Object) {
      return await this.applyObjects([update]);
    } else {
      console.log('Invalid resource definition, neither a list of resources nor a single valid resource');
    }
  }
}
