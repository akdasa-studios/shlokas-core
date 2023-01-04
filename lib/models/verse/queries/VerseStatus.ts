import { Query, QueryBuilder } from '@akdasa-studios/framework'
import { VerseId, VerseStatus } from '@lib/models'

const queryBuilder = new QueryBuilder<VerseStatus>()

export function verseId(verseId: VerseId) : Query<VerseStatus> {
  return queryBuilder.eq('verseId', verseId)
}

export function versesId(versesId: VerseId[]) : Query<VerseStatus> {
  return queryBuilder.in('verseId', versesId)
}