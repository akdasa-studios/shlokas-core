import { Query, QueryBuilder } from '@akdasa-studios/framework'
import { Language, Verse, VerseNumber } from '@lib/models'

export const queryBuilder = new QueryBuilder<Verse>()

export function number(number: VerseNumber | string): Query<Verse> {
  const searchNumber = typeof number === 'string' ? new VerseNumber(number) : number
  const queryBuilder = new QueryBuilder<Verse>()
  return queryBuilder.eq('number', searchNumber)
}

export function content(text: string): Query<Verse> {
  return queryBuilder.or(
    queryBuilder.contains('text.lines', text),
    queryBuilder.contains('number.value', text),
    queryBuilder.contains('translation.text', text),
  )
}

export function language(lang: Language) {
  const queryBuilder = new QueryBuilder<Verse>()
  return queryBuilder.eq('language', lang)
}