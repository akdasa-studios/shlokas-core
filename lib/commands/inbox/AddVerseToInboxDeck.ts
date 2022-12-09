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

  execute(context: Application): Result<readonly InboxCard[], string> {
    const addedCards = context.inboxDeck.addVerse(this._verseId)
    return Result.ok(addedCards)
  }

  revert(context: Application): void {
    context.inboxDeck.removeVerse(this._verseId)
  }
}