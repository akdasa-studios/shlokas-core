import { Command, Result } from '@akdasa-studios/framework'
import { Application } from '@lib/app/Application'
import * as InboxCardQueries from '@lib/models/cards/queries/InboxCard'
import {
  Decks, VerseId, VerseStatus,
  VerseStatusId, NoStatus
} from '@lib/models'


export class UpdateVerseStatus implements
  Command<Application, Result<VerseStatus, string>>
{
  private _previousDeck: Decks = Decks.None
  private _status: VerseStatus

  constructor(public readonly verseId: VerseId) {
  }

  async execute(context: Application): Promise<Result<VerseStatus, string>> {
    const { ofVerse } = InboxCardQueries
    this._status = await context.library.getStatus(this.verseId)
    const inboxCards = await context.inboxDeck.findCards(ofVerse(this.verseId))
    const reviewCards = await context.reviewDeck.findCards(ofVerse(this.verseId))

    if (this._status.equals(NoStatus)) {
      this._status = new VerseStatus(new VerseStatusId(), this.verseId)
    }

    this._previousDeck = this._status.inDeck
    if (reviewCards.length > 0) {
      this._status.movedToDeck(Decks.Review)
    } else if (inboxCards.length > 0) {
      this._status.movedToDeck(Decks.Inbox)
    } else {
      this._status.movedToDeck(Decks.None)
    }

    await context.repositories.verseStatuses.save(this._status)
    return Result.ok(this._status)
  }

  async revert(context: Application): Promise<void> {
    this._status.movedToDeck(this._previousDeck)
    await context.repositories.verseStatuses.save(this._status)
  }
}