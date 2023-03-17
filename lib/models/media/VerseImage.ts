import { Aggregate, UuidIdentity } from '@akdasa-studios/framework'
import { VerseId } from '@lib/models/verse'


export class VerseImageId extends UuidIdentity<'VerseImageId'> {}

/**
 * Verse Image
 */
export class VerseImage extends Aggregate<VerseImageId> {
  /**
   * Initialize a new Instance of the VerseImage class
   * @param id Id of the verse image
   * @param verseId Verse id image belongs to
   * @param theme Theme of the verse image
   * @param url Uri to download image from
   */
  constructor(
    id: VerseImageId,
    public readonly verseId: VerseId,
    public readonly theme: string,
    public readonly url: string
  ) {
    super(id)
  }
}
