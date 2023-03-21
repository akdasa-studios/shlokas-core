import { Aggregate, UuidIdentity } from '@akdasa-studios/framework'
import { Language, Synonym, Text, Translation, VerseNumber } from '@lib/models'


/**
 * Verse Identity
 */
export class VerseId extends UuidIdentity<'VerseId'> {}

/**
 * Verse
 */
export class Verse extends Aggregate<VerseId> {
  constructor(
    id: VerseId,
    public readonly number: VerseNumber,
    public readonly reference: string,
    public readonly language: Language,
    public readonly text: Text,
    public readonly translation: Translation,
    public readonly synonyms: Synonym[],
  ) {
    super(id)
  }
}
