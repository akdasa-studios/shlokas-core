import { Command, Result } from '@akdasa-studios/framework'
import { InboxCard } from '@lib/models/cards'
import { InboxContext } from './InboxContext'


export class InboxCardMemorized implements Command<InboxContext, Result<InboxCard, string>> {
  private _inboxCard: InboxCard

  constructor(inboxCard: InboxCard) {
    this._inboxCard = inboxCard
  }

  execute(context: InboxContext): Result<InboxCard, string> {
    context.deck.removeCard(this._inboxCard)
    return Result.ok(this._inboxCard)
  }

  revert(context: InboxContext): void {
    context.deck.addCard(this._inboxCard)
  }
}
