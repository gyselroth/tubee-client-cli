import { Command } from 'commandpost';
import { RootOptions, RootArgs } from '../main';
import TubeeClient from '../tubee.client';
const yaml = require('js-yaml');
const fs = require('fs');
import { Config, configPath } from '../tubee.client';
const keytar = require('keytar');
const path = require('path');
const api = require('@gyselroth/tubee-sdk-typescript-node');

export interface LoginOptions {
  username: string;
  password: string;
  prompt: boolean;
  server: string;
  config: string;
}

export interface LoginArgs {
  resource: string;
  name?: string;
}

/**
 * Operation
 */
export default class Login {
  /**
   * Apply cli options
   */
  public static factory(optparse: Command<RootOptions, RootArgs>, client: TubeeClient) {
    let remote = optparse.subCommand<LoginOptions, LoginArgs>('login').description('Login resources');
    remote
      .option('-u, --username <name>', 'Define the output format (One of yaml,json)')
      .option('-p, --password <name>', 'Define the output format (One of yaml,json)')
      .option('-P, --prompt <name>', 'Define the output format (One of yaml,json)')
      .option('-s, --server <name>', 'File to read from')
      .action(async (opts, args, rest) => {
        var config = {} as Config;

        if (opts.username[0]) {
          config.username = opts.username[0];
        }

        if (opts.password[0]) {
          keytar.setPassword('tubee', config.username || 'admin', opts.password[0]);
        }

        if (opts.server[0]) {
          config.url = opts.server[0];
        }

        var server = config.url || 'http://localhost:8090';
        var client = new api['DefaultApi'](server + '/api/v1');
        var auth = new api.HttpBasicAuth();
        auth.username = config.username || 'admin';
        auth.password = config.password;
        client.setDefaultAuthentication(auth);

        try {
          var result = await client.root();

          if (result.response.body.name !== 'tubee') {
            throw new Error('server is not a tubee server');
          }

          console.log('Successfully connected to server %s', server);
        } catch (Error) {
          console.log('Failed connect to server %s', server);
          return;
        }

        var writePath = optparse.parsedOpts.config[0] || configPath;
        var configDir = path.dirname(writePath);
        if (!fs.existsSync(configDir)) {
          fs.mkdirSync(configDir, {
            recursive: true,
          });
        }

        fs.writeFileSync(writePath, yaml.dump(config));
      });
  }
}
