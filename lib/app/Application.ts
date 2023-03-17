import { Processor, Repository } from '@akdasa-studios/framework'
import { SyncRepository, SyncService } from '@akdasa-studios/framework-sync'
import { TimeController, TimeMachine } from '@lib/app/TimeMachine'
import { Declamation, InboxCard, InboxDeck, ReviewCard, ReviewDeck, Verse, VerseImage, VerseStatus } from '@lib/models'
import { Library } from './Library'
import { Settings } from './Settings'
import { InboxCardConflictSolver, ReviewCardConflictSolver, VerseStatusConflictSolver } from './sync'

export class Repositories {
  constructor(
    public readonly verses: Repository<Verse>,
    public readonly verseImages: Repository<VerseImage>,
    public readonly declamations: Repository<Declamation>,
    public readonly verseStatuses: SyncRepository<VerseStatus>,
    public readonly inboxCards: SyncRepository<InboxCard>,
    public readonly reviewCards: SyncRepository<ReviewCard>
  ) {}
}

export class Application {
  private _inboxDeck: InboxDeck
  private _reviewDeck: ReviewDeck
  private _processor = new Processor<Application>(this)
  private _library: Library
  private _settings = new Settings()

  /**
   * Initializes a new instance of Application class.
   * @param versesRepository Repository of verses
   */
  constructor(
    public readonly repositories: Repositories
  ) {
    this._library = new Library(
      repositories.verses,
      repositories.verseStatuses,
      repositories.verseImages,
      repositories.declamations
    )
    this._inboxDeck = new InboxDeck(repositories.inboxCards)
    this._reviewDeck = new ReviewDeck(repositories.reviewCards)
  }

  get timeMachine() : TimeController {
    return TimeMachine
  }

  /**
   * Returns the processor.
   * @returns Processor
   */
  get processor() : Processor<Application> {
    return this._processor
  }

  /**
   * Returns the inbox deck.
   * @returns Inbox deck
   */
  get inboxDeck() : InboxDeck {
    return this._inboxDeck
  }

  /**
   * Returns the review deck.
   * @returns Review deck
   */
  get reviewDeck() : ReviewDeck {
    return this._reviewDeck
  }

  /**
   * Returns the verses library.
   * @returns Verses library
   */
  get library() : Library {
    return this._library
  }

  /**
   * Returns the settings.
   * @returns Settings
   */
  get settings() : Settings {
    return this._settings
  }

  /**
   * Syncs the application with remote repositories.
   * @param remoteReposiories Remote repositories to sync with
   */
  async sync(remoteReposiories: Repositories) {
    await new SyncService(new InboxCardConflictSolver())
      .sync(this.repositories.inboxCards, remoteReposiories.inboxCards)
    await new SyncService(new ReviewCardConflictSolver())
      .sync(this.repositories.reviewCards, remoteReposiories.reviewCards)
    await new SyncService(new VerseStatusConflictSolver())
      .sync(this.repositories.verseStatuses, remoteReposiories.verseStatuses)
  }
}
