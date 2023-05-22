import { AnyCommand, AnyResult, Command, Event, Processor, Transaction } from '@akdasa-studios/framework'
import { SyncOptions, SyncService } from '@akdasa-studios/framework-sync'
import { TimeMachine } from '@lib/app'
import { InboxDeck, ReviewDeck } from '@lib/models'
import { Context, Repositories } from './Context'
import { Library } from './Library'
import { InboxCardConflictSolver, ReviewCardConflictSolver, VerseStatusConflictSolver } from './sync'


export class Application {
  private _context: Context
  public readonly contextChanged = new Event<Context>()
  public readonly commandExecuted = new Event<Command<Context, AnyResult>>()
  public readonly commandReverted = new Event<Command<Context, AnyResult>>()

  /**
   * Initializes a new instance of Application class.
   */
  constructor(
    context: Context
  ) {
    this._context = context
  }

  get timeMachine(): TimeMachine {
    return this._context.timeMachine
  }

  /**
   * Returns the processor.
   * @returns Processor
   */
  get processor(): Processor<Context> {
    return this._context.processor
  }

  /**
   * Returns the inbox deck.
   * @returns Inbox deck
   */
  get inboxDeck(): InboxDeck {
    return this._context.inboxDeck
  }

  /**
   * Returns the review deck.
   * @returns Review deck
   */
  get reviewDeck(): ReviewDeck {
    return this._context.reviewDeck
  }

  /**
   * Returns the verses library.
   * @returns Verses library
   */
  get library(): Library {
    return this._context.library
  }

  async execute<T extends AnyResult>(command: Command<Context, T>, transaction?: Transaction): Promise<T> {
    const res = await this._context.processor.execute(command, transaction)
    this.commandExecuted.notify(command)
    return res
  }

  async revert(): Promise<readonly AnyCommand[]> {
    const revertedCommands = await this._context.processor.revert()
    for (const command of revertedCommands) {
      this.commandReverted.notify(command)
    }
    return revertedCommands
  }

  get repositories(): Repositories {
    return this._context.repositories
  }

  get context(): Context {
    return this._context
  }

  changeContext(context: Context) {
    this._context = context
    this.contextChanged.notify(context)
  }

  /**
   * Syncs the application with remote repositories.
   * @param context Remote repositories to sync with
   * @param options Sync options
   */
  async sync(
    context: Context,
    options?: SyncOptions
  ) {
    await new SyncService(new InboxCardConflictSolver())
      .sync(this._context.repositories.inboxCards, context.repositories.inboxCards, options)
    await new SyncService(new ReviewCardConflictSolver())
      .sync(this._context.repositories.reviewCards, context.repositories.reviewCards, options)
    await new SyncService(new VerseStatusConflictSolver())
      .sync(this._context.repositories.verseStatuses, context.repositories.verseStatuses, options)
  }
}
