import { UuidIdentity, Aggregate } from '@akdasa-studios/framework'
import { HasVersion } from '@akdasa-studios/framework-sync'
import { VerseId } from '@lib/models/verse'


export class CardId extends UuidIdentity<'CardId'> {}

export abstract class Card extends Aggregate<CardId> implements HasVersion {
  constructor(
    id: CardId,
    public readonly verseId: VerseId
  ) {
    super(id)
  }

  /**
   * Version
   */
  version: string
}