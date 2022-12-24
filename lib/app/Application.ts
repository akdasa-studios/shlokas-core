import { Processor, Repository } from '@akdasa-studios/framework'
import { TimeController, TimeMachine } from '@lib/app/TimeMachine'
import { InboxCard, InboxDeck, ReviewDeck, Verse, VerseStatus } from '@lib/models'
import { Library } from './Library'
import { Settings } from './Settings'

export class Repositories {
  constructor(
    public readonly verses: Repository<Verse>,
    public readonly verseStatuses: Repository<VerseStatus>,
    public readonly inboxCards: Repository<InboxCard>
  ) {}
}

export class Application {
  private _inboxDeck: InboxDeck
  private _reviewDeck = new ReviewDeck()
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
}

