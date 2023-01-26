import { Command, Result } from '@akdasa-studios/framework'
import { Application } from '@lib/app/Application'
import { VerseId } from '@lib/models'
import { InboxCard } from '@lib/models/cards'


export class RemoveVerseFromInboxDeck implements
  Command<Application, Result<readonly InboxCard[], string>>
{
  private _removedCards: readonly InboxCard[] = []

  constructor(public readonly verseId: VerseId) {
  }

  async execute(context: Application): Promise<Result<readonly InboxCard[], string>> {
    this._removedCards = await context.inboxDeck.removeVerse(this.verseId)
    return Result.ok(this._removedCards)
  }

  async revert(context: Application): Promise<void> {
    for(const card of this._removedCards) {
      await context.inboxDeck.addCard(card)
    }
  }
}