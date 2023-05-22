import { UuidIdentity, Aggregate } from '@akdasa-studios/framework'
import { Syncable } from '@akdasa-studios/framework-sync'
import { VerseId } from '@lib/models/verse'


export class CardId extends UuidIdentity<'CardId'> {}

export abstract class Card extends Aggregate<CardId> implements Syncable {
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

  /**
   * Synced at
   */
  syncedAt: number
}