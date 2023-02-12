import { Aggregate, AnyIdentity, Processor, Repository } from '@akdasa-studios/framework'
import { ConflictSolver, SyncRepository, SyncService } from '@akdasa-studios/framework-sync'
import { TimeController, TimeMachine } from '@lib/app/TimeMachine'
import { Decks, InboxCard, InboxDeck, ReviewCard, ReviewDeck, Verse, VerseStatus } from '@lib/models'
import { Library } from './Library'
import { Settings } from './Settings'

export class Repositories {
  constructor(
    public readonly verses: Repository<Verse>,
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
      repositories.verseStatuses
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

  async sync(remoteReposiories: Repositories) {
    await new SyncService(new InboxCardConflictSolver())
      .sync(this.repositories.inboxCards, remoteReposiories.inboxCards)
    await new SyncService(new ReviewCardConflictSolver())
      .sync(this.repositories.reviewCards, remoteReposiories.reviewCards)
    await new SyncService(new VerseStatusConflictSolver())
      .sync(this.repositories.verseStatuses, remoteReposiories.verseStatuses)
  }
}

class InboxCardConflictSolver implements ConflictSolver<InboxCard> {
  solve(object1: InboxCard, object2: InboxCard): Aggregate<AnyIdentity> {
    // Stryker disable next-line all
    return object1 || object2
  }
}
class ReviewCardConflictSolver implements ConflictSolver<ReviewCard> {
  solve(object1: ReviewCard, object2: ReviewCard): Aggregate<AnyIdentity> {
    // Stryker disable next-line all
    return object1.lapses > object2.lapses ? object1 : object2
  }
}

class VerseStatusConflictSolver implements ConflictSolver<VerseStatus> {
  solve(object1: VerseStatus, object2: VerseStatus): Aggregate<AnyIdentity> {
    if (object1.inDeck !== object2.inDeck) {
      const object1Progress = Object.keys(Decks).indexOf(object1.inDeck)
      const object2Progress = Object.keys(Decks).indexOf(object2.inDeck)
      // Stryker disable next-line all
      return (object1Progress >= object2Progress) ? object1 : object2
    }
    return object1
  }
}