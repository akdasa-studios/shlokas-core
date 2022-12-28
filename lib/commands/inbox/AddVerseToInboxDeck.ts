import { Command, Result } from '@akdasa-studios/framework'
import { Application } from '@lib/app/Application'

import { VerseId } from '@lib/models'
import { InboxCard } from '@lib/models/cards'


export class AddVerseToInboxDeck implements
  Command<Application, Result<readonly InboxCard[], string>>
{
  private _verseId: VerseId

  constructor(verseId: VerseId) {
    this._verseId = verseId
  }

  async execute(context: Application): Promise<Result<readonly InboxCard[], string>> {
    const addedCards = await context.inboxDeck.addVerse(this._verseId)
    return Result.ok(addedCards)
  }

  async revert(context: Application): Promise<void> {
    await context.inboxDeck.removeVerse(this._verseId)
  }
}