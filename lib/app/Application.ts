import { Processor, Repository } from '@akdasa-studios/framework'
import { InboxDeck, Verse } from '@lib/models'
import { Library } from './Library'
import { Settings } from './Settings'

export class Application {
  private _inboxDeck = new InboxDeck()
  private _processor = new Processor<Application>(this)
  private _library: Library
  private _settings = new Settings()

  /**
   * Initializes a new instance of Application class.
   * @param versesRepository Repository of verses
   */
  constructor(
    versesRepository: Repository<Verse>,
  ) {
    this._library = new Library(versesRepository)
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

