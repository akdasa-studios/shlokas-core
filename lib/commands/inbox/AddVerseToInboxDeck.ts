import { Result } from '@akdasa-studios/framework'
import { ICommand } from '@akdasa-studios/framework'

import { VerseId } from '@lib/models'
import { InboxCard, InboxCardBuilder, InboxCardType } from '@lib/models'

import { InboxContext } from './InboxContext'


export class AddVerseToInboxDeck implements ICommand<InboxContext, Result<InboxCard[], string>> {
  private _verseId: VerseId
  private _addedCards: InboxCard[] = []

  constructor(verseId: VerseId) {
    this._verseId = verseId
  }

  execute(context: InboxContext): Result<InboxCard[], string> {
    // create two cards for the verse
    const card1 = this.getCard.ofType(InboxCardType.Translation).build()
    const card2 = this.getCard.ofType(InboxCardType.Transliteration).build()

    // add the cards to the deck
    context.deck.addCard(card1)
    context.deck.addCard(card2)

    // store the added cards
    this._addedCards = [card1, card2]

    // return the added cards
    return Result.ok(this._addedCards) // TODO: make copy
  }

  revert(context: InboxContext): void {
    for(const card of this._addedCards) {
      context.deck.removeCard(card)
    }
  }

  private get getCard(): InboxCardBuilder {
    return new InboxCardBuilder()
      .ofVerse(this._verseId)
      .addedAt(new Date())
  }
}