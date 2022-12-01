import { UuidIdentity, Aggregate } from '@akdasa-studios/framework'
import { VerseId } from '@lib/models/verse'


export class CardId extends UuidIdentity<'CardId'> {}

export abstract class Card extends Aggregate<CardId> {
  constructor(
    id: CardId,
    public readonly verseId: VerseId
  ) {
    super(id)
  }
}