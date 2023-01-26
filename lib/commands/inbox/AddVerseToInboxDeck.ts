import { Command, Result } from '@akdasa-studios/framework'
import { Application } from '@lib/app/Application'

import { VerseId } from '@lib/models'
import { InboxCard } from '@lib/models/cards'


export class AddVerseToInboxDeck implements
  Command<Application, Result<readonly InboxCard[], string>>
{
  constructor(public readonly verseId: VerseId) {
  }

  async execute(context: Application): Promise<Result<readonly InboxCard[], string>> {
    const addedCards = await context.inboxDeck.addVerse(this.verseId)
    return Result.ok(addedCards)
  }

  async revert(context: Application): Promise<void> {
    await context.inboxDeck.removeVerse(this.verseId)
  }
}