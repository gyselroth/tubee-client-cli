import { Command } from 'commandpost';
import { RootOptions, RootArgs } from '../main';
import TubeeClient from '../tubee.client';
const yaml = require('js-yaml');
const fs = require('fs');
import { Config, Context, ConfigStore, keytarPath, configPath } from '../config';
const keytar = require('keytar');
keytar.setPath(keytarPath);
const path = require('path');
const { CoreV1Api, HttpBasicAuth, localVarRequest } = require('@gyselroth/tubee-sdk-node');
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
    let remote = optparse.subCommand<LoginOptions, LoginArgs>('login').description('Login and configure tubee server');
    remote
      .option('-u, --username <name>', 'HTTP basic auth username')
      .option('-p, --password <name>', 'HTTP basic auth password')
      .option('-P, --prompt', 'HTTP basuc auth prompt for password input')
      .option('-s, --server <name>', 'URL to tubee server (For example https://example.org)')
      .option('-a, --allow-self-signed', 'Allow self signed server certificate')
      .action(async (opts, args, rest) => {
        var context = {} as Context;
        if (opts.username[0]) {
          context.username = opts.username[0];
        }

        if (optparse.parsedOpts.debug === true) {
          localVarRequest.debug = true;
        }

        var contextName = optparse.parsedOpts.context[0] || 'default';
        var password;

        if (opts.password[0]) {
          password = opts.password[0];
          keytar.setPassword('tubee', contextName, opts.password[0]);
        }

        if (opts.prompt) {
          password = await prompt('Enter password: ', { method: 'hide' });
          keytar.setPassword('tubee', context.username || 'admin', password);
        }

        if (opts.server[0]) {
          context.url = opts.server[0];
        }

        if (opts.allowSelfSigned) {
          process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
          context.allowSelfSigned = true;
        } else {
          context.allowSelfSigned = false;
        }

        var server = context.url || 'https://localhost:8090';

        if (!/^https?:\/\//i.test(server)) {
          context.url = server = 'https://' + server;
        }

        var client = new CoreV1Api(server);
        var basic = new HttpBasicAuth();

        basic.username = context.username || 'admin';
        basic.password = password;
        client.setDefaultAuthentication(basic);

        client
          .getV1()
          .then(result => {
            if (result.response.body.name !== 'tubee') {
              console.error('server is not a tubee server');
            }

            console.log('Successfully connected to server %s', server);
            var writePath = optparse.parsedOpts.config[0] || configPath;
            ConfigStore.writeContext(writePath, contextName, context);
          })
          .catch(err => {
            console.error('Connection error encountered (use --debug to display more)');

            if (optparse.parsedOpts.debug === true) {
              console.log(err);
            }
          });
      });
  }
}
