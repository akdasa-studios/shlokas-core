import { Query, QueryBuilder } from '@akdasa-studios/framework'
import { InboxCard, InboxCardType, VerseId } from '@lib/models'

export const queryBuilder = new QueryBuilder<InboxCard>()

export function ofVerse(id: VerseId): Query<InboxCard> {
  return queryBuilder.eq('verseId', id)
}

export function ofType(type: InboxCardType): Query<InboxCard>  {
  return queryBuilder.eq('type', type)
}
