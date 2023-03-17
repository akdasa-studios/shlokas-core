import { Query, QueryBuilder } from '@akdasa-studios/framework'
import { VerseReference, Declamation } from '@lib/models'

const queryBuilder = new QueryBuilder<Declamation>()

export function verseReference(verseReference: VerseReference) : Query<Declamation> {
  return queryBuilder.eq('verseReference', verseReference)
}
