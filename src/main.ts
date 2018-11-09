import * as commandpost from 'commandpost';
import Login from './operations/login';
import Get from './operations/get';
import Edit from './operations/edit';
import Delete from './operations/delete';
import Create from './operations/create';
import Explain from './operations/explain';
import Sync from './operations/sync';
import TubeeClient from './tubee.client';

export interface RootOptions {
  config: string;
}

export interface RootArgs {}

let root = commandpost
  .create<RootOptions, RootArgs>('')
  .option('-c, --config <file>', 'Specify the config for the client (If different than ~/.tubee/config)');

var client = new TubeeClient();
Login.factory(root, client);
Get.factory(root, client);
Edit.factory(root, client);
Explain.factory(root, client);
Delete.factory(root, client);
Create.factory(root, client);
Sync.factory(root, client);

commandpost.exec(root, process.argv).catch(err => {
  if (err instanceof Error) {
    console.error(err.stack);
  } else {
    console.error(err);
  }
  process.exit(1);
});
