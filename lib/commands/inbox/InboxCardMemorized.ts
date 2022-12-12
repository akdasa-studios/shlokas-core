import { Command, Result } from '@akdasa-studios/framework'
import { Application } from '@lib/app/Application'
import { InboxCard } from '@lib/models/cards'


export class InboxCardMemorized implements
  Command<Application, Result<void, string>>
{
  private _inboxCard: InboxCard

  constructor(inboxCard: InboxCard) {
    this._inboxCard = inboxCard
  }

  execute(context: Application): Result<void, string> {
    context.inboxDeck.cardMemorized(this._inboxCard)
    return Result.ok()
  }

  revert(context: Application): void {
    // TODO: doesn't restore to the same position
    context.inboxDeck.addCard(this._inboxCard)
  }
}
