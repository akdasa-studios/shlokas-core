import { VerseReference } from './../models/verse/VerseReference'
import { Query, Repository } from '@akdasa-studios/framework'
import {
  Language, NoStatus, Verse, VerseId, VerseNumber, VerseQueries,
  VerseStatus, VerseStatusQueries, VerseImage, Declamation, VerseImageQueries,
  DeclamationQueries
} from '@lib/models'

/**
 * Verses library
 */
export class Library {
  private _verses: Repository<Verse>
  private _statuses: Repository<VerseStatus>
  private _images: Repository<VerseImage>
  private _declamations: Repository<Declamation>

  /**
   * Initialize a new instance of Library class with the given parameters.
   * @param verses Repository of verses
   * @param verseStatuses Repository of verses status
   */
  constructor(
    verses: Repository<Verse>,
    verseStatuses: Repository<VerseStatus>,
    verseImages: Repository<VerseImage>,
    declamations: Repository<Declamation>
  ) {
    this._verses = verses
    this._statuses = verseStatuses
    this._images = verseImages
    this._declamations = declamations
  }

  async find(query: Query<Verse>): Promise<readonly Verse[]> {
    // TODO: pagination
    return (await this._verses.find(query)).entities
  }

  /**
   * Returns all verses
   * @returns List of all verses in the library
   */
  async all(lang: Language): Promise<readonly Verse[]> {
    const result = await this._verses.find(VerseQueries.language(lang))
    return result.entities
  }

  /**
   * Gets verse by ID
   * @param id Id of a verse
   * @returns Result of operation
   */
  async getById(id: VerseId): Promise<Verse> {
    return await this._verses.get(id)
  }

  /**
   * Finds a verse by its number.
   * @param number Number of the verse
   * @returns Result of the operation
   * @remarks If the verse is not found, the result will be a failure.
   */
  async getByNumber(lang: Language, verseNumber: VerseNumber | string): Promise<Verse> {
    const query = VerseQueries.queryBuilder.and(
      VerseQueries.language(lang),
      VerseQueries.number(verseNumber)
    )
    const result = await this._verses.find(query)
    if (result.entities.length === 0) { throw new Error(`Verse not found by ${lang.code} and ${verseNumber}`) }
    return result.entities[0]
  }

  async findByContent(lang: Language, queryString: string): Promise<readonly Verse[]> {
    const result = await this._verses.find(VerseQueries.queryBuilder.and(
      VerseQueries.language(lang),
      VerseQueries.content(queryString)
    ))
    // TODO: pagination
    return result.entities
  }

  /**
   * Adds a verse to the library.
   * @param verse Verse to add
   * @returns Result of the operation
   */
  async addVerse(verse: Verse) {
    await this._verses.save(verse)
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Status                                   */
  /* -------------------------------------------------------------------------- */

  /**
   * Gets status of the verse. Creates it if it doesn't exist.
   * @param verseId Id of the verse
   * @returns Result of the operation
   */
  async getStatus(verseId: VerseId): Promise<VerseStatus> {
    const result = await this.getStatuses([verseId])
    return result[verseId.value]
  }

  async getStatuses(versesId: VerseId[]): Promise<{[verseId:VerseId['value']]: VerseStatus}> {
    const query = VerseStatusQueries.versesId(versesId)
    const verses = (await this._statuses.find(query)).entities

    const result = {}
    for (const vid of versesId) {
      result[vid.value] = verses.find(x => x.verseId.equals(vid)) || NoStatus
    }
    return result
  }


  /* -------------------------------------------------------------------------- */
  /*                                    Media                                   */
  /* -------------------------------------------------------------------------- */

  async getImages(verseId: VerseId): Promise<readonly VerseImage[]> {
    return (await this._images.find(VerseImageQueries.verseId(verseId))).entities
  }

  async getDeclamations(verseReference: VerseReference): Promise<readonly Declamation[]> {
    return (await this._declamations.find(DeclamationQueries.verseReference(verseReference))).entities
  }
}
