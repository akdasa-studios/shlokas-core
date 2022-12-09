import { Command, Result } from '@akdasa-studios/framework'
import { Application } from '@lib/app/Application'
import { InboxCard } from '@lib/models/cards'


export class InboxCardMemorized implements
  Command<Application, Result<InboxCard, string>>
{
  private _inboxCard: InboxCard

  constructor(inboxCard: InboxCard) {
    this._inboxCard = inboxCard
  }

  execute(context: Application): Result<InboxCard, string> {
    context.inboxDeck.cardMemorized(this._inboxCard)
    return Result.ok(this._inboxCard)
  }

  revert(context: Application): void {
    context.inboxDeck.addCard(this._inboxCard)
  }
}
