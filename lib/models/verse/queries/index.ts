import { Query, QueryBuilder } from '@akdasa-studios/framework'
import { Verse, VerseId } from '../Verse'
import { VerseNumber } from '../VerseNumber'
import { VerseStatus } from '../VerseStatus'

export class VerseQueries {
  public static byNumber(number: VerseNumber | string): Query<Verse> {
    let searchNumber: VerseNumber
    if (typeof number === 'string') {
      searchNumber = new VerseNumber(number)
    } else {
      searchNumber = number
    }
    const queryBuilder = new QueryBuilder<Verse>()
    return queryBuilder.eq('number', searchNumber)
  }

  public static byContent(text: string): Query<Verse> {
    const queryBuilder = new QueryBuilder<Verse>()
    return queryBuilder.or(
      queryBuilder.contains('text.lines', text),
      queryBuilder.contains('number.value', text),
      queryBuilder.contains('translation.text', text),
    )
  }
}

export class VerseStatusQueries {
  public static byVerseId(verseId: VerseId) : Query<VerseStatus> {
    const queryBuilder = new QueryBuilder<VerseStatus>()
    return queryBuilder.eq('verseId', verseId)
  }
}