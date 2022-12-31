import { Query, QueryBuilder } from '@akdasa-studios/framework'
import { ReviewCard, VerseId, ReviewCardType } from '@lib/models'

export const queryBuilder = new QueryBuilder<ReviewCard>()

export function ofVerse(id: VerseId): Query<ReviewCard> {
  return queryBuilder.eq('verseId', id)
}

export function ofType(type: ReviewCardType): Query<ReviewCard>  {
  return queryBuilder.eq('type', type)
}

export function dueTo(date: Date): Query<ReviewCard>  {
  return queryBuilder.lte('dueTo', date)
}

export function ofVerseAndType(
  id: VerseId, type: ReviewCardType
): Query<ReviewCard>  {
  return queryBuilder.and(
    ofVerse(id),
    ofType(type)
  )
}
