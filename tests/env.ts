import { InMemoryRepository } from '@akdasa-studios/framework'
import { SyncRepository } from '@akdasa-studios/framework-sync'
import { Application, Repositories } from '@lib/app/Application'
import {
  InboxCard, Language,
  ReviewCard, ReviewCardBuilder, ReviewCardType, Verse,
  VerseBuilder, VerseId, VerseImage, VerseImageId, VerseNumber,
  VerseStatus, Declamation, DeclamationId, VerseReference, DeclamationType
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

export function createVerseImage(verseId: VerseId, theme='default'): VerseImage {
  return new VerseImage(
    new VerseImageId(),
    verseId,
    theme,
    'url',
  )
}

export function createDeclamation(
  verseReference: VerseReference,
  type: DeclamationType='verse'
): Declamation {
  return new Declamation(
    new DeclamationId(),
    verseReference,
    type,
    'default',
    'url',
    []
  )
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
    new InMemoryRepository<VerseImage>(),
    new InMemoryRepository<Declamation>(),
    new SyncRepository(new InMemoryRepository<VerseStatus>()),
    new SyncRepository(new InMemoryRepository<InboxCard>()),
    new SyncRepository(new InMemoryRepository<ReviewCard>())
  ))
}