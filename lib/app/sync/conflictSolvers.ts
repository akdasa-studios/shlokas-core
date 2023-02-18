import { Aggregate, AnyIdentity, Logger } from '@akdasa-studios/framework'
import { ConflictSolver } from '@akdasa-studios/framework-sync'
import { Decks, InboxCard, ReviewCard, VerseStatus } from '@lib/models'

const syncLogger = new Logger('Sync')
// Stryker disable all

export class InboxCardConflictSolver implements ConflictSolver<InboxCard> {
  solve(object1: InboxCard, object2: InboxCard): Aggregate<AnyIdentity> {
    syncLogger.debug('Inbox card conflict', {
      object1: JSON.stringify(object1),
      object2: JSON.stringify(object2),
      winner: object1.isMemorized ? 'object1' : 'object2'
    })
    return object1.isMemorized ? object1 : object2
  }
}

export class ReviewCardConflictSolver implements ConflictSolver<ReviewCard> {
  solve(object1: ReviewCard, object2: ReviewCard): Aggregate<AnyIdentity> {
    return object1.lapses > object2.lapses ? object1 : object2
  }
}

export class VerseStatusConflictSolver implements ConflictSolver<VerseStatus> {
  solve(object1: VerseStatus, object2: VerseStatus): Aggregate<AnyIdentity> {
    if (object1.inDeck !== object2.inDeck) {
      const object1Progress = Object.keys(Decks).indexOf(object1.inDeck)
      const object2Progress = Object.keys(Decks).indexOf(object2.inDeck)
      return (object1Progress >= object2Progress) ? object1 : object2
    }
    return object1
  }
}