import { Query, Repository, Result } from '@akdasa-studios/framework'
import {
  Language, Verse, VerseId, VerseNumber, VerseQueries,
  VerseStatus, VerseStatusId, VerseStatusQueries
} from '@lib/models'

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

  async find(query: Query<Verse>): Promise<readonly Verse[]> {
    return (await this._verses.find(query)).value
  }

  /**
   * Returns all verses
   * @returns List of all verses in the library
   */
  async all(lang: Language): Promise<readonly Verse[]> {
    return (await this._verses.find(VerseQueries.language(lang))).value
  }

  /**
   * Gets verse by ID
   * @param id Id of a verse
   * @returns Result of operation
   */
  async getById(id: VerseId): Promise<Result<Verse, string>> {
    return await this._verses.get(id)
  }

  /**
   * Finds a verse by its number.
   * @param number Number of the verse
   * @returns Result of the operation
   * @remarks If the verse is not found, the result will be a failure.
   */
  async getByNumber(lang: Language, verseNumber: VerseNumber | string): Promise<Result<Verse, string>> {
    const result = (await this._verses.find(VerseQueries.queryBuilder.and(
      VerseQueries.language(lang),
      VerseQueries.number(verseNumber)
    ))).value
    if (result.length === 0) {
      return Result.fail('Verse not found: ' + verseNumber.toString())
    }
    return Result.ok(result[0])
  }

  async findByContent(lang: Language, queryString: string): Promise<readonly Verse[]> {
    return (await this._verses.find(VerseQueries.queryBuilder.and(
      VerseQueries.language(lang),
      VerseQueries.content(queryString)
    ))).value
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

  /* -------------------------------------------------------------------------- */
  /*                                   Status                                   */
  /* -------------------------------------------------------------------------- */

  /**
   * Gets status of the verse. Creates it if it doesn't exist.
   * @param verseId Id of the verse
   * @returns Result of the operation
   */
  async getStatus(verseId: VerseId): Promise<Result<VerseStatus, string>> {
    const result = (await this._statuses.find(VerseStatusQueries.verseId(verseId))).value
    if (result.length == 0) {
      const verseStatus = new VerseStatus(new VerseStatusId(), verseId)
      this._statuses.save(verseStatus)
      return Result.ok(verseStatus)
    }
    return Result.ok(result[0])
  }
}
