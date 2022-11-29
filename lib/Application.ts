import { InboxDeck, Verse, VerseNumber, VerseNumberBuilder } from '@lib/models'
import { Result } from '@akdasa-studios/framework/core'
import { Processor } from '@akdasa-studios/framework/commands'
import { IRepository } from '@akdasa-studios/framework/domain/persistence'
import { Query } from '@akdasa-studios/framework/domain/persistence/query'

export class Application {
  private _inboxDeck = new InboxDeck()
  private _processor = new Processor(this)
  private _versesLibrary: VersesLibrary

  constructor(
    versesRepository: IRepository<Verse>,
  ) {
    this._versesLibrary = new VersesLibrary(versesRepository)
  }

  get inboxDeck() {
    return this._inboxDeck
  }

  get processor() {
    return this._processor
  }

  get versesLibrary() {
    return this._versesLibrary
  }
}

export class VersesLibrary {
  private _repository: IRepository<Verse>
  constructor(repository: IRepository<Verse>) {
    this._repository = repository
  }

  findVerseByNumber(number: string): Result<Verse, string> {
    if (typeof number === 'string') {
      const verseNumber = new VerseNumberBuilder().fromString(number).build()
      if (verseNumber.isFailure) { return Result.fail('Incorrect verse number: ' + number) }

      const query = new QueryBuilder()

      this._repository.find()
    }
  }
}