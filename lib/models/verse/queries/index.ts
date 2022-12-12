import { Query, QueryBuilder } from '@akdasa-studios/framework'
import { Verse } from '../Verse'
import { VerseNumber, VerseNumberBuilder } from '../VerseNumber'

export class VerseQueries {
  public static byNumber(number: VerseNumber | string): Query<Verse> {
    let searchNumber: VerseNumber
    if (typeof number === 'string') {
      searchNumber = new VerseNumberBuilder().fromString(number).build().value
    } else {
      searchNumber = number
    }
    const queryBuilder = new QueryBuilder<Verse>()
    return queryBuilder.eq('number', searchNumber)
  }
}