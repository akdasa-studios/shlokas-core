import { Command, Result } from '@akdasa-studios/framework'
import { Application } from '@lib/Application'

import { VerseId } from '@lib/models'
import { InboxCard, InboxCardBuilder, InboxCardType } from '@lib/models/cards'


export class AddVerseToInboxDeck implements Command<Application, Result<InboxCard[], string>> {
  private _verseId: VerseId
  private _addedCards: InboxCard[] = []

  constructor(verseId: VerseId) {
    this._verseId = verseId
  }

  execute(context: Application): Result<InboxCard[], string> {
    // create two cards for the verse
    const card1 = this.getCard.ofType(InboxCardType.Translation).build()
    const card2 = this.getCard.ofType(InboxCardType.Text).build()

    // add the cards to the deck
    context.inboxDeck.addCard(card1)
    context.inboxDeck.addCard(card2)

    // store the added cards
    this._addedCards = [card1, card2]

    // return the added cards
    return Result.ok(this._addedCards) // TODO: make copy
  }

  revert(context: Application): void {
    for(const card of this._addedCards) {
      context.inboxDeck.removeCard(card)
    }
  }

  private get getCard(): InboxCardBuilder {
    return new InboxCardBuilder()
      .ofVerse(this._verseId)
      .addedAt(new Date())
  }
}