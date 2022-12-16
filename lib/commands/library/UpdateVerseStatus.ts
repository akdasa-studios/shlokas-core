import { Command, Result } from '@akdasa-studios/framework'
import { Application } from '@lib/app/Application'

import { Decks, VerseId, VerseStatus } from '@lib/models'


export class UpdateVerseStatus implements
  Command<Application, Result<VerseStatus, string>>
{
  private _verseId: VerseId
  private _previousDeck: Decks = Decks.None
  private _status: VerseStatus

  constructor(verseId: VerseId) {
    this._verseId = verseId
  }

  execute(context: Application): Result<VerseStatus, string> {
    this._status = context.library.getStatusById(this._verseId).value

    const inboxCards = context.inboxDeck.getVerseCards(this._verseId)
    if (inboxCards.length > 0) {
      this._previousDeck = this._status.inDeck
      this._status.movedToDeck(Decks.Inbox)
      context.repositories.verseStatuses.save(this._status)
    } else {
      this._status.movedToDeck(Decks.None)
    }

    return Result.ok(this._status)
  }

  revert(context: Application): void {
    this._status.movedToDeck(this._previousDeck)
    context.repositories.verseStatuses.save(this._status)
  }
}