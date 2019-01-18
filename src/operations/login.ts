import { Command } from 'commandpost';
import { RootOptions, RootArgs } from '../main';
import TubeeClient from '../tubee.client';
const yaml = require('js-yaml');
const fs = require('fs');
import { Config, ConfigStore, keytarPath, configPath } from '../config';
const keytar = require('keytar');
keytar.setPath(keytarPath);
const path = require('path');
const { v1, auth } = require('@gyselroth/tubee-sdk-node');
const prompt = require('password-prompt');

export interface LoginOptions {
  username: string;
  password: string;
  prompt: boolean;
  server: string;
  config: string;
  allowSelfSigned: boolean;
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
  public static async factory(optparse: Command<RootOptions, RootArgs>, client: TubeeClient) {
    let remote = optparse.subCommand<LoginOptions, LoginArgs>('login').description('Login resources');
    remote
      .option('-u, --username <name>', 'HTTP basic auth username')
      .option('-p, --password <name>', 'HTTP basic auth password')
      .option('-P, --prompt', 'HTTP basuc auth prompt for password input')
      .option('-s, --server <name>', 'URL to tubee server (For example https://example.org)')
      .option('-a, --allow-self-signed', 'Allow self signed server certificate')
      .action(async (opts, args, rest) => {
        var config = {} as Config;
        if (opts.username[0]) {
          config.username = opts.username[0];
        }

        if (opts.password[0]) {
          keytar.setPassword('tubee', config.username || 'admin', opts.password[0]);
        }

        if (opts.prompt) {
          let password = await prompt('Enter password: ');
          keytar.setPassword('tubee', config.username || 'admin', password);
        }

        if (opts.server[0]) {
          config.url = opts.server[0];
        }

        if (opts.allowSelfSigned) {
          process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
          config.allowSelfSigned = true;
        } else {
          config.allowSelfSigned = false;
        }

        var server = config.url || 'https://localhost:8090';
        var client = new v1['DefaultApi'](server + '/api/v1');
        var basic = new auth.basic();
        basic.username = config.username || 'admin';
        basic.password = opts.password[0];
        client.setDefaultAuthentication(basic);
        var result = await client.root();
        if (result.response.body.name !== 'tubee') {
          throw new Error('server is not a tubee server');
        }

        console.log('Successfully connected to server %s', server);

        var writePath = optparse.parsedOpts.config[0] || configPath;
        ConfigStore.write(writePath, config);
      });
  }
}
