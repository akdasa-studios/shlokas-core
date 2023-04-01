import { Command, Result } from '@akdasa-studios/framework'
import { Context } from '@lib/app'
import { InboxCard, VerseId } from '@lib/models'


export class AddVerseToInboxDeck implements
  Command<Context, Result<readonly InboxCard[], string>>
{
  constructor(public readonly verseId: VerseId) {
  }

  async execute(context: Context): Promise<Result<readonly InboxCard[], string>> {
    const addedCards = await context.inboxDeck.addVerse(this.verseId)
    return Result.ok(addedCards)
  }

  async revert(context: Context): Promise<void> {
    await context.inboxDeck.removeVerse(this.verseId)
  }
}