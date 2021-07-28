import { Command } from 'commandpost';
import TubeeClient from '../../tubee.client';
import { EditOptions, EditArgs } from '../../operations/edit';
import AbstractEdit from '../abstract.edit';
import { Config, ConfigStore, keytarPath, configPath } from '../../config';
const yaml = require('js-yaml');
const fs = require('fs');
const randomstring = require('randomstring');
const fspath = require('path');
const os = require('os');

/**
 * Edit resources
 */
export default class Edit extends AbstractEdit {
  /**
   * Apply cli options
   */
  public static applyOptions(optparse: Command<EditOptions, EditArgs>, client: TubeeClient) {
    return optparse
      .subCommand<EditOptions, any>('config')
      .description('Edit tubectl client config')
      .action(async (opts, args, rest) => {
        var config = ConfigStore.getAll(optparse.parent.parsedOpts);
        var instance = new Edit(null);
        this.executeOperation(
          instance.execute(config, optparse.parent.parsedOpts.config[0] || configPath, opts, args, rest),
        );
      });
  }

  /**
   * Execute
   */
  public async execute(config, configPath, opts, args, rest) {
    this.editObjects(config, opts, async (name, patch, resource) => {
      return await ConfigStore.write(configPath, resource);
    });
  }

  /**
   * Edit config
   */
  public async editObjects(config, opts, callback) {
    var body: string;

    switch (opts.output[0]) {
      case 'json':
        body = JSON.stringify(config, null, 2);
        break;

      case 'yaml':
      default:
        body = yaml.dump(config);
    }

    var path: string = fspath.join(os.tmpdir(), '.' + randomstring.generate(7) + '.' + (opts.output[0] || 'yml'));

    await fs.writeFile(path, body, function (err) {
      if (err) {
        return console.log(err);
      }
    });

    return this.openEditor(callback, config, path, opts.output[0]);
  }
}
