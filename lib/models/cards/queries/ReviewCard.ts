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

export function active(): Query<ReviewCard> {
  // NOTE: just dunny query, should be replaced
  return queryBuilder.not(
    queryBuilder.eq('addedAt', undefined)
  )
}