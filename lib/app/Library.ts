import { Fail, Query, Repository, Result } from '@akdasa-studios/framework'
import { Verse, VerseId, VerseNumber, VerseQueries, VerseStatus, VerseStatusId, VerseStatusQueries } from '@lib/models'

/**
 * Verses library
 */
export class Library {
  private _verses: Repository<Verse>
  private _statuses: Repository<VerseStatus>

  /**
   * Initialize a new instance of Library class with the given parameters.
   * @param verses Repository of verses
   * @param verseStatuses Repository of verses status
   */
  constructor(
    verses: Repository<Verse>,
    verseStatuses: Repository<VerseStatus>
  ) {
    this._verses = verses
    this._statuses = verseStatuses
  }

  get all(): readonly Verse[] {
    return this._verses.all()
  }

  find(query: Query<Verse>): readonly Verse[] {
    return this._verses.find(query)
  }

  finqByString(queryString: string): readonly Verse[] {
    return this._verses.find(VerseQueries.byContent(queryString))
  }

  /**
   * Adds a verse to the library.
   * @param verse Verse to add
   * @returns Result of the operation
   */
  addVerse(verse: Verse): Result<Verse, string> {
    this._verses.save(verse)
    return Result.ok(verse)
  }

  /**
   * Finds a verse by its number.
   * @param number Number of the verse
   * @returns Result of the operation
   * @remarks If the verse is not found, the result will be a failure.
   */
  getByNumber(verseNumber: VerseNumber | string): Result<Verse, string> {
    const result = this._verses.find(VerseQueries.byNumber(verseNumber))
    if (result.length === 0) {
      return Result.fail('Verse not found: ' + verseNumber.toString())
    }
    return Result.ok(result[0])
  }

  getById(id: VerseId) : Result<Verse, string> {
    const result = this._verses.get(id)
    if (result.isFailure) {
      return Result.fail('Verse not found: ' + id.value)
    }
    return Result.ok(result.value)
  }

  /**
   * Gets status of the verse. Creates it if it doesn't exist.
   * @param verseId Id of the verse
   * @returns Result of the operation
   */
  getStatusById(verseId: VerseId): Result<VerseStatus, string> {
    const result = this._statuses.find(VerseStatusQueries.byVerseId(verseId))
    if (result.length == 0) {
      const verseStatus = new VerseStatus(new VerseStatusId(), verseId)
      this._statuses.save(verseStatus)
      return Result.ok(verseStatus)
    }
    return Result.ok(result[0])
  }

  /**
   * Gets status of the verse by its number. Creates it if it doesn't exist.
   * @param number Number of the verse
   * @returns Result of the operation
   * @remarks If the verse is not found, the result will be a failure.
   */
  getStatusByNumber(verseNumber: VerseNumber | string): Result<VerseStatus, string> {
    const verse = this.getByNumber(verseNumber)
    if (verse.isFailure) { return Fail('No verse ' + verseNumber.toString() + ' found') }
    return this.getStatusById(verse.value.id)
  }
}
