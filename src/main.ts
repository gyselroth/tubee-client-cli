import * as commandpost from 'commandpost';
import Login from './operations/login';
import Get from './operations/get';
import Edit from './operations/edit';
import Delete from './operations/delete';
import Create from './operations/create';
import Explain from './operations/explain';
import Sync from './operations/sync';
import Apply from './operations/apply';
import TubeeClient from './tubee.client';

const map = [Login, Get, Create, Edit, Explain, Delete, Sync, Apply];

export interface RootOptions {
  config: string;
  context: string;
  debug: boolean;
}

export interface RootArgs {}

let root = commandpost
  .create<RootOptions, RootArgs>('')
  .option('-f, --config <file>', 'Specify the config for the client (If different than ~/.tubee/config)')
  .option('-c, --context <name>', 'Specify a tubee context (Using a different tubee environement)')
  .option('-d, --debug', 'Print request in verbose mode)');

var client = new TubeeClient();
for (let operation of map) {
  operation.factory(root, client);
}

commandpost.exec(root, process.argv).catch(err => {
  if (err.response && err.response.body) {
    console.log('%s: %s [code: %s]', err.response.body.error, err.response.body.message, err.response.body.code);
  }

  if (err.message) {
    console.log(err.message);
  }

  process.exit(1);
});
