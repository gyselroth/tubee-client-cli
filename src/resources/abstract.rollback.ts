import { Command } from 'commandpost';
import { RollbackOptions, RollbackArgs } from '../operations/rollback';
import TubeeClient from '../tubee.client';
const yaml = require('js-yaml');
const fs = require('fs');
const rollbackor = process.env.EDITOR || 'vim';
const child_process = require('child_process');
const jsonpatch = require('fast-json-patch');
const randomstring = require('randomstring');
import AbstractEdit from './abstract.edit';
const os = require('os');
const fspath = require('path');

/**
 * Rollback resources
 */
export default abstract class AbstractRollback extends AbstractEdit {
  /**
   * Execute
   */
  public async rollbackObject(response, opts, callback) {
    var objects = response.response.toJSON().body;
    var last;
    var current = objects.data.shift();
    var currentVersion = current.version;
    var lastVersion = current.version - 1;

    if (opts.revision.length > 0) {
      lastVersion = opts.revision[0];
    }

    for (let resource of objects.data) {
      if (resource.version == lastVersion) {
        last = resource;
      }
    }

    if (last === undefined) {
      console.log('No version %s found in resource history', lastVersion);
      process.exit();
    }

    return this.updateObjects(current, last, callback);
  }
}
