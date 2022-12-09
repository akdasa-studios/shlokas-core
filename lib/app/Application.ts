import { Processor, Repository } from '@akdasa-studios/framework'
import { InboxDeck, Verse } from '@lib/models'
import { Settings } from './Settings'
import { VersesLibrary } from './VersesLibrary'

export class Application {
  private _inboxDeck = new InboxDeck()
  private _processor = new Processor<Application>(this)
  private _versesLibrary: VersesLibrary
  private _settings = new Settings()

  /**
   * Initializes a new instance of Application class.
   * @param versesRepository Repository of verses
   */
  constructor(
    versesRepository: Repository<Verse>,
  ) {
    this._versesLibrary = new VersesLibrary(versesRepository)
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
  get versesLibrary() : VersesLibrary {
    return this._versesLibrary
  }

  /**
   * Returns the settings.
   * @returns Settings
   */
  get settings() : Settings {
    return this._settings
  }
}

