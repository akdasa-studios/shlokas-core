import { InMemoryRepository } from '@akdasa-studios/framework'
import { Application, Repositories } from '@lib/app/Application'
import { InboxCard, ReviewCard, Verse, VerseStatus } from '@lib/models'

export function createApplication() {
  return new Application(new Repositories(
    new InMemoryRepository<Verse>(),
    new InMemoryRepository<VerseStatus>(),
    new InMemoryRepository<InboxCard>(),
    new InMemoryRepository<ReviewCard>()
  ))
}