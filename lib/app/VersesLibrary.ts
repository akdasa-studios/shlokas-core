import { QueryBuilder, Repository, Result } from '@akdasa-studios/framework'
import { Verse, VerseId, VerseNumber } from '@lib/models'

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
  findVerseByNumber(verseNumber: VerseNumber): Result<Verse, string> {
    const queryBuilder = new QueryBuilder<Verse>()
    const query = queryBuilder.eq('number', verseNumber)

    const result = this._repository.find(query)

    if (result.length === 0) {
      return Result.fail('Verse not found: ' + verseNumber.toString())
    }
    return Result.ok(result[0])
  }

  findVerseById(id: VerseId) : Result<Verse, string> {
    const result = this._repository.get(id)
    if (result.isFailure) {
      return Result.fail('Verse not found: ' + id.toString())
    }
    return Result.ok(result.value)
  }
}
