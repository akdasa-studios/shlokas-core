import { Aggregate, UuidIdentity } from '@akdasa-studios/framework'
import { VerseReference } from '@lib/models'

export type DeclamationType = 'verse' | 'translation'

export class DeclamationId extends UuidIdentity<'DeclamationId'> {}

/**
 * Verse Image
 */
export class Declamation extends Aggregate<DeclamationId> {
  constructor(
    id: DeclamationId,
    public readonly verseReference: VerseReference,
    public readonly type: DeclamationType,
    public readonly theme: string,
    public readonly url: string,
    public readonly markers: number[]
  ) {
    super(id)
  }
}
