import { QueryBuilder, Repository, Result } from '@akdasa-studios/framework'
import { Verse, VerseNumberBuilder } from '@lib/models'

/**
 * Verses library
 */
export class VersesLibrary {
  private _repository: Repository<Verse>

  /**
   * Initialize a new instance of VersesLibrary class with the given parameters.
   * @param repository Repository of verses
   */
  constructor(repository: Repository<Verse>) {
    this._repository = repository
  }

  /**
   * Adds a verse to the library.
   * @param verse Verse to add
   * @returns Result of the operation
   */
  addVerse(verse: Verse): Result<Verse, string> {
    this._repository.save(verse)
    return Result.ok(verse)
  }

  /**
   * Finds a verse by its number.
   * @param number Number of the verse
   * @returns Result of the operation
   * @remarks If the verse is not found, the result will be a failure.
   */
  findVerseByNumber(number: string): Result<Verse, string> {
    if (typeof number === 'string') {
      const verseNumber = new VerseNumberBuilder().fromString(number).build()
      if (verseNumber.isFailure) { return Result.fail('Incorrect verse number: ' + number) }

      const queryBuilder = new QueryBuilder<Verse>()
      const query = queryBuilder.eq('number', verseNumber.value)

      const result = this._repository.find(query)

      if (result.length === 0) { return Result.fail('Verse not found: ' + number) }
      if (result.length > 1) { return Result.fail('More than one verse found: ' + number) }
      return Result.ok(result[0])
    }
    return Result.fail('Incorrect verse number: ' + number)
  }
}
