import { Command, Result } from '@akdasa-studios/framework'
import { Application } from '@lib/Application'
import { VerseId } from '@lib/models'
import { InboxCard } from '@lib/models/cards'


export class RemoveVerseFromInboxDeck implements
  Command<Application, Result<readonly InboxCard[], string>>
{
  private _verseId: VerseId
  private _removedCards: readonly InboxCard[] = []

  constructor(verseId: VerseId) {
    this._verseId = verseId
  }

  execute(context: Application): Result<readonly InboxCard[], string> {
    this._removedCards = context.inboxDeck.removeVerse(this._verseId)
    return Result.ok(this._removedCards)
  }

  revert(context: Application): void {
    for(const card of this._removedCards) {
      context.inboxDeck.addCard(card)
    }
  }
}