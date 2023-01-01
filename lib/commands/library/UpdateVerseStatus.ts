import { Command, Result } from '@akdasa-studios/framework'
import { Application } from '@lib/app/Application'

import { Decks, InboxCardQueries, VerseId, VerseStatus } from '@lib/models'


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
    this._status = (await context.library.getStatus(this._verseId)).value
    const inboxCards = await context.inboxDeck.findCards(ofVerse(this._verseId))

    if (inboxCards.length > 0) {
      this._previousDeck = this._status.inDeck
      this._status.movedToDeck(Decks.Inbox)
      await context.repositories.verseStatuses.save(this._status)
    } else {
      this._status.movedToDeck(Decks.None)
    }

    return Result.ok(this._status)
  }

  async revert(context: Application): Promise<void> {
    this._status.movedToDeck(this._previousDeck)
    await context.repositories.verseStatuses.save(this._status)
  }
}