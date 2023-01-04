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
  private _verseId: VerseId
  private _previousDeck: Decks = Decks.None
  private _status: VerseStatus

  constructor(verseId: VerseId) {
    this._verseId = verseId
  }

  async execute(context: Application): Promise<Result<VerseStatus, string>> {
    const { ofVerse } = InboxCardQueries
    this._status = await context.library.getStatus(this._verseId)
    const inboxCards = await context.inboxDeck.findCards(ofVerse(this._verseId))

    if (this._status.equals(NoStatus)) {
      this._status = new VerseStatus(new VerseStatusId(), this._verseId)
    }

    if (inboxCards.length > 0) {
      this._previousDeck = this._status.inDeck
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