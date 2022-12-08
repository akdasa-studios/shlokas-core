import { Processor, QueryBuilder, Repository, Result } from '@akdasa-studios/framework'
import { InboxDeck, Language, Verse, VerseNumberBuilder } from '@lib/models'

export class Application {
  private _inboxDeck = new InboxDeck()
  private _processor = new Processor<Application>(this)
  private _versesLibrary: VersesLibrary
  private _language: Language = new Language('en', 'English')

  constructor(
    versesRepository: Repository<Verse>,
  ) {
    this._versesLibrary = new VersesLibrary(versesRepository)
  }

  get inboxDeck() : InboxDeck {
    return this._inboxDeck
  }

  get processor() : Processor<Application> {
    return this._processor
  }

  get versesLibrary() : VersesLibrary {
    return this._versesLibrary
  }

  get language() : Language {
    return this._language
  }
}

export class VersesLibrary {
  private _repository: Repository<Verse>
  constructor(repository: Repository<Verse>) {
    this._repository = repository
  }

  addVerse(verse: Verse): Result<Verse, string> {
    this._repository.save(verse)
    // console.log(this._repository.find({}))
    return Result.ok(verse)
  }

  findVerseByNumber(number: string): Result<Verse, string> {
    if (typeof number === 'string') {
      const verseNumber = new VerseNumberBuilder().fromString(number).build()
      if (verseNumber.isFailure) { return Result.fail('Incorrect verse number: ' + number) }

      const queryBuilder = new QueryBuilder<Verse>()
      const query = queryBuilder.eq('number', verseNumber.value)
      // const query = queryBuilder.eq('transliteration', 'dharma-ksetre kuru-ksetre')


      const result = this._repository.find(query)
      // console.log('>>>>>> ', result, '<<<<<<<<')

      if (result.length === 0) { return Result.fail('Verse not found: ' + number) }
      if (result.length > 1) { return Result.fail('More than one verse found: ' + number) }
      return Result.ok(result[0])
    }
    return Result.fail('Incorrect verse number: ' + number)
  }
}