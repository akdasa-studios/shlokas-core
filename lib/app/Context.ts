import { Library } from './Library'
import { Repository, Processor} from '@akdasa-studios/framework'
import { SyncRepository } from '@akdasa-studios/framework-sync'
import { TimeMachine } from '@lib/app'
import { Declamation, InboxCard, InboxDeck, ReviewCard, ReviewDeck, Verse, VerseImage, VerseStatus } from '@lib/models'


export class Context {
  public readonly library: Library
  public readonly inboxDeck: InboxDeck
  public readonly reviewDeck: ReviewDeck
  public readonly processor: Processor<Context>

  constructor(
    public readonly name: string,
    public readonly timeMachine: TimeMachine,
    public readonly repositories: Repositories

  ) {
    this.library = new Library(
      repositories.verses,
      repositories.verseStatuses,
      repositories.verseImages,
      repositories.declamations
    )
    this.inboxDeck = new InboxDeck(repositories.inboxCards)
    this.reviewDeck = new ReviewDeck(repositories.reviewCards)
    this.processor = new Processor(this)
  }
}

export class Repositories {
  constructor(
    public readonly verses: Repository<Verse>,
    public readonly verseImages: Repository<VerseImage>,
    public readonly declamations: Repository<Declamation>,
    public readonly verseStatuses: SyncRepository<VerseStatus>,
    public readonly inboxCards: SyncRepository<InboxCard>,
    public readonly reviewCards: SyncRepository<ReviewCard>
  ) { }
}