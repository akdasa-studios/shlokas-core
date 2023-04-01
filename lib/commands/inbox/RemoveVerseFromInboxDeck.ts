import { Command, Result } from '@akdasa-studios/framework'
import { Context } from '@lib/app/Context'
import { VerseId } from '@lib/models'
import { InboxCard } from '@lib/models/cards'


export class RemoveVerseFromInboxDeck implements
  Command<Context, Result<readonly InboxCard[], string>>
{
  private _removedCards: readonly InboxCard[] = []

  constructor(public readonly verseId: VerseId) {
  }

  async execute(context: Context): Promise<Result<readonly InboxCard[], string>> {
    this._removedCards = await context.inboxDeck.removeVerse(this.verseId)
    return Result.ok(this._removedCards)
  }

  async revert(context: Context): Promise<void> {
    for(const card of this._removedCards) {
      await context.inboxDeck.addCard(card)
    }
  }
}