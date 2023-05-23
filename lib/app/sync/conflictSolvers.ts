import { AnyIdentity } from '@akdasa-studios/framework'
import { SyncAggregate, SyncConflictSolver } from '@akdasa-studios/framework-sync'
import { Decks, InboxCard, ReviewCard, VerseStatus } from '@lib/models'

// Stryker disable all

export class InboxCardConflictSolver implements SyncConflictSolver<InboxCard> {
  solve(object1: InboxCard, object2: InboxCard): SyncAggregate<AnyIdentity> {
    return object1.memorizedAt ? object1 : object2
  }
}

export class ReviewCardConflictSolver implements SyncConflictSolver<ReviewCard> {
  solve(object1: ReviewCard, object2: ReviewCard): SyncAggregate<AnyIdentity> {
    return object1.lapses >= object2.lapses
      ? (object1.dueTo.getTime() > object2.dueTo.getTime() ? object1 : object2)
      : object2
  }
}

export class VerseStatusConflictSolver implements SyncConflictSolver<VerseStatus> {
  solve(object1: VerseStatus, object2: VerseStatus): SyncAggregate<AnyIdentity> {
    if (object1.inDeck !== object2.inDeck) {
      const object1Progress = Object.keys(Decks).indexOf(object1.inDeck)
      const object2Progress = Object.keys(Decks).indexOf(object2.inDeck)
      return (object1Progress >= object2Progress) ? object1 : object2
    }
    return object1
  }
}