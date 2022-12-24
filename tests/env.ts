import {
  ReviewCard, ReviewCardBuilder, ReviewCardType, Verse,
  VerseBuilder, VerseNumber
} from '@lib/models'

export function createVerseNumber(verseNumberStr: string): VerseNumber {
  return new VerseNumber(verseNumberStr)
}

export function createVerse(verseNumberStr: string): Verse {
  const verseNumber = createVerseNumber(verseNumberStr)
  return new VerseBuilder().withNumber(verseNumber).build().value
}

export function createReviewCard(
  verse: Verse,
  type: ReviewCardType,
  dueTo: Date = new Date('2020-01-01')
): ReviewCard {
  return new ReviewCardBuilder()
    .ofType(type)
    .ofVerse(verse.id)
    .dueTo(dueTo)
    .build()
}