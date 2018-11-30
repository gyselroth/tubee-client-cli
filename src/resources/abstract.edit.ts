import { Command } from 'commandpost';
import { EditOptions, EditArgs } from '../operations/edit';
import TubeeClient from '../tubee.client';
const yaml = require('js-yaml');
const fs = require('fs');
const editor = process.env.EDITOR || 'vim';
const child_process = require('child_process');
const md5File = require('md5-file');
const jsonpatch = require('fast-json-patch');
const randomstring = require('randomstring');
import AbstractOperation from './abstract.operation';
const os = require('os');
const fspath = require('path');

/**
 * Edit resources
 */
export default abstract class AbstractEdit extends AbstractOperation {
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
  public async editObjects(response, opts, callback) {
    var body: string;

    switch (opts.output[0]) {
      case 'json':
        body = JSON.stringify(response.response.toJSON().body, null, 2);
        break;

      case 'yaml':
      default:
        body = yaml.dump(response.response.toJSON().body);
    }

    var path: string = fspath.join(os.tmpdir(), '.' + randomstring.generate(7) + '.' + (opts.output[0] || 'yml'));

    await fs.writeFile(path, body, function(err) {
      if (err) {
        return console.log(err);
      }
    });

    return this.openEditor(callback, response.response.toJSON().body, path, opts.output[0]);
  }

  /**
   * Open editor to edit resources
   */
  protected async openEditor(callback, objects, path: string, output: string, md5?: string) {
    return new Promise(async (resolve, reject) => {
      var child = child_process.spawn(editor, [path], {
        stdio: 'inherit',
      });

      await child.on('exit', async (e, code) => {
        var body: string = fs.readFileSync(path, 'utf-8');
        var update;

        try {
          switch (output) {
            case 'json':
              update = JSON.parse(body);
              break;

            case 'yaml':
            default:
              update = yaml.safeLoad(body);
          }

          await this.updateObjects(objects, update, callback).catch(response => {
            throw new Error(response.response.body.error + ' - ' + response.response.body.message);
          });

          resolve();
        } catch (error) {
          body = '#' + error + '\n' + body;
          var result = this.writeError(callback, body, objects, path, output, md5);

          if (!result) {
            reject();
          }
        }
      });
    });
  }

  /**
   * Write error to file
   */
  protected async writeError(callback, body, objects, path: string, output: string, md5?: string) {
    await fs.writeFile(path, body, function(err) {
      if (err) {
        return console.log(err);
      }
    });

    var sum = md5File.sync(path);

    if (sum === md5) {
      return false;
    }

    this.openEditor(callback, objects, path, output, sum);
  }

  /**
   * Update Objects
   */
  protected async updateObjects(update, existing, callback) {
    if (update.kind == 'List') {
      for (let resource of update.data) {
        let to = resource;
        let from = this.findObject(existing, resource.name);
        let patch = jsonpatch.compare(to, from);

        if (patch.length > 0) {
          var result = await callback(resource.name, patch);
          console.log('Updated resource %s', resource.name);
        } else {
          console.log('No changes have been made for %s', resource.name);
        }
      }
    } else if (update.kind) {
      return await this.updateObjects({ kind: 'List', data: [update] }, { kind: 'List', data: [existing] }, callback);
    }
  }

  /**
   * Find object in haystack
   */
  protected findObject(haystack, needle) {
    for (let resource of haystack.data) {
      if (resource.name === needle) {
        return resource;
      }
    }
  }
}
