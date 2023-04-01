import { InMemoryRepository } from '@akdasa-studios/framework'
import { SyncRepository } from '@akdasa-studios/framework-sync'
import { Application } from '@lib/app/Application'
import { Context, Repositories } from '@lib/app/Context'
import { TimeMachine } from '@lib/app/TimeMachine'
import {
  InboxCard, Language,
  ReviewCard, ReviewCardBuilder, ReviewCardType, Verse,
  VerseId, VerseImage, VerseImageId, VerseNumber,
  VerseStatus, Declamation, DeclamationId, VerseReference,
  DeclamationType, Translation, Text
} from '@lib/models'
import * as getUuid from 'uuid-by-string'



export function createVerseNumber(verseNumberStr: string): VerseNumber {
  return new VerseNumber(verseNumberStr)
}

export function createVerse(verseNumberStr: string, lang = 'en'): Verse {
  return new Verse(
    new VerseId(getUuid(verseNumberStr)),
    createVerseNumber(verseNumberStr),
    verseNumberStr,
    new Language(lang, lang),
    new Text(['text']),
    new Translation('translation'),
    []
  )
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
  return new Application(
    createContext('test')
  )
}

export function createContext(name: string) {
  return new Context(
    name,
    new TimeMachine(),
    new Repositories(
      new InMemoryRepository<Verse>(),
      new InMemoryRepository<VerseImage>(),
      new InMemoryRepository<Declamation>(),
      new SyncRepository(new InMemoryRepository<VerseStatus>()),
      new SyncRepository(new InMemoryRepository<InboxCard>()),
      new SyncRepository(new InMemoryRepository<ReviewCard>())
    )
  )
}