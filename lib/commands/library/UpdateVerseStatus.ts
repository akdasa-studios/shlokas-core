import { Command, Result } from '@akdasa-studios/framework'
import { Application } from '@lib/app/Application'
import { Decks, VerseId, VerseStatus } from '@lib/models'
import * as InboxCardQueries from '@lib/models/cards/queries/InboxCard'


export class UpdateVerseStatus implements
  Command<Application, Result<VerseStatus, string>>
{
  private _previousDeck: Decks = Decks.None
  private _status: VerseStatus

  constructor(public readonly verseId: VerseId) {
  }

  async execute(context: Application): Promise<Result<VerseStatus, string>> {
    const { ofVerse } = InboxCardQueries
    const inboxCards = await context.inboxDeck.findCards(ofVerse(this.verseId))
    const reviewCards = await context.reviewDeck.findCards(ofVerse(this.verseId))

    this._status = new VerseStatus(this.verseId)

    this._previousDeck = this._status.inDeck
    if (reviewCards.length > 0) {
      this._status.movedToDeck(Decks.Review)
    } else if (inboxCards.length > 0) {
      this._status.movedToDeck(Decks.Inbox)
    }

    await context.repositories.verseStatuses.save(this._status)
    return Result.ok(this._status)
  }

  async revert(context: Application): Promise<void> {
    this._status.movedToDeck(this._previousDeck)
    await context.repositories.verseStatuses.save(this._status)
  }
}