import { Command } from 'commandpost';
import { CreateOptions, CreateArgs } from '../operations/create';
import TubeeClient from '../tubee.client';
const yaml = require('js-yaml');
const fs = require('fs');
const editor = process.env.EDITOR || 'vim';
const child_process = require('child_process');
import AbstractOperation from './abstract.operation';
const SwaggerParser = require('swagger-parser');
const specPath = 'node_modules/@gyselroth/tubee-sdk-node/swagger.yml';
const randomstring = require('randomstring');
const os = require('os');
const fspath = require('path');
const merge = require('lodash.merge');

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
      return this.openEditor(callback, opts.file[0], opts.input[0]);
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

        return this.openEditor(callback, path, opts.input[0]);
      });
    } else if (opts.fromTemplate.length > 0) {
      var path: string = fspath.join(os.tmpdir(), '.' + randomstring.generate(7) + '.yml');

      if (opts.fromTemplate[0] !== '') {
        resourceType = opts.fromTemplate[0];
      }

      SwaggerParser.validate(specPath, async (err, api) => {
        if (err) {
          console.error('Failed to retrieve the resource specification', err);
        } else if (api.definitions[resourceType]) {
          body = this.createTemplate(this.merge(api.definitions[resourceType]).properties);
        }

        await fs.writeFile(path, body, function(err) {
          if (err) {
            return console.log(err);
          }
        });

        return this.openEditor(callback, path, opts.input[0]);
      });
    } else {
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

      return this.openEditor(callback, path, opts.input[0]);
    }
  }

  /**
   * Swagger perse
   */
  protected merge(definition) {
    if(!definition.allOf) {
      return definition;
    } 

    var result = {};
    for(let resource of definition.allOf) {
      if(resource.allOf) {
        result = merge(result, this.merge(resource));
      } else {
        result = merge(result, resource); 
      }
    }

    return result;
  }

  /**
   * Create resource template from openapi specs
   */
  protected createTemplate(definition, depth = 0) {
    var body: string = '';

    for (let attr in definition) {
      body +=
        ''.padStart(depth, ' ') +
        attr +
        ': ' +
        (definition[attr].default || null) +
        ' #<' +
        definition[attr].type +
        this.parseEnum(definition[attr]) +
        '> ' +
        definition[attr].description +
        '\n';
      
      if (definition[attr].type == 'object' || !definition[attr].type && definition[attr].properties) {
        body += this.createTemplate(definition[attr].properties, depth + 2);
      }
    }

    return body;
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
  protected async openEditor(callback, path: string, input: string, existing?: string) {
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

          await this.applyObjects(update, callback).catch(response => {
            if (response.response) {
              throw new Error(response.response.body.error + ' - ' + response.response.body.message);
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

          this.openEditor(callback, path, input, new_hash);
        }
      });
    });
  }

  /**
   * Update Objects
   */
  protected async applyObjects(update, callback) {
    if (update instanceof Array) {
      for (let resource of update) {
        let result = await callback(resource);
        console.log('Created new resource %s', resource.name);
      }
    } else if (update instanceof Object) {
      return await this.applyObjects([update], callback);
    } else {
      console.log('Invalid resource definition, neither a list of resources nor a single valid resource');
    }
  }
}
