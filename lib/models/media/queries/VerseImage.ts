import { Query, QueryBuilder } from '@akdasa-studios/framework'
import { VerseId, VerseImage } from '@lib/models'

const queryBuilder = new QueryBuilder<VerseImage>()

export function verseId(verseId: VerseId) : Query<VerseImage> {
  return queryBuilder.eq('verseId', verseId)
}
