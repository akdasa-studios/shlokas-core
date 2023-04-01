import { Command, Result } from '@akdasa-studios/framework'
import { Context } from '@lib/app/Context'
import { Decks, VerseId, VerseStatus } from '@lib/models'
import * as InboxCardQueries from '@lib/models/cards/queries/InboxCard'
import * as ReviewCardQueries from '@lib/models/cards/queries/ReviewCard'


export class UpdateVerseStatus implements
  Command<Context, Result<VerseStatus, string>>
{
  private _previousDeck: Decks = Decks.None
  private _status: VerseStatus

  constructor(public readonly verseId: VerseId) {
  }

  async execute(context: Context): Promise<Result<VerseStatus, string>> {
    const { ofVerse } = InboxCardQueries
    const { ofVerse: ofVerse2 } = ReviewCardQueries
    const inboxCards = await context.inboxDeck.findCards(ofVerse(this.verseId))
    const reviewCards = await context.reviewDeck.findCards(ofVerse2(this.verseId))

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

  async revert(context: Context): Promise<void> {
    this._status.movedToDeck(this._previousDeck)
    await context.repositories.verseStatuses.save(this._status)
  }
}