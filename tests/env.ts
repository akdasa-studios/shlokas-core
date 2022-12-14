import { InMemoryRepository } from '@akdasa-studios/framework'
import { Application, Repositories } from '@lib/app/Application'
import {
  InboxCard, Language,
  ReviewCard, ReviewCardBuilder, ReviewCardType, Verse,
  VerseBuilder, VerseNumber, VerseStatus
} from '@lib/models'



export function createVerseNumber(verseNumberStr: string): VerseNumber {
  return new VerseNumber(verseNumberStr)
}

export function createVerse(verseNumberStr: string, lang = 'en'): Verse {
  const verseNumber = createVerseNumber(verseNumberStr)
  return new VerseBuilder()
    .withNumber(verseNumber)
    .ofLanguage(new Language(lang, lang))
    .build().value
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

export function createApplication() {
  return new Application(new Repositories(
    new InMemoryRepository<Verse>(),
    new InMemoryRepository<VerseStatus>(),
    new InMemoryRepository<InboxCard>(),
    new InMemoryRepository<ReviewCard>()
  ))
}