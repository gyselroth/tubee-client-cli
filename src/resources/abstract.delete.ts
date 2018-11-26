import { Command } from 'commandpost';
import { DeleteOptions, DeleteArgs } from '../operations/delete';
import TubeeClient from '../tubee.client';
import AbstractOperation from './abstract.operation';

/**
 * Delete resources
 */
export default abstract class AbstractDelete extends AbstractOperation {
  protected optparse: Command<DeleteOptions, DeleteArgs>;
  protected client: TubeeClient;

  /**
   * Construct
   */
  constructor(optparse: Command<DeleteOptions, DeleteArgs>, client: TubeeClient) {
    super();
    this.optparse = optparse;
    this.client = client;
  }
}
