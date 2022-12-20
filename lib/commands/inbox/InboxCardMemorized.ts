import { Command, Result } from '@akdasa-studios/framework'
import { Application } from '@lib/app/Application'
import { InboxCard, InboxCardType, ReviewCardBuilder, ReviewCardType } from '@lib/models/cards'


export class InboxCardMemorized implements
  Command<Application, Result<void, string>>
{
  private _inboxCard: InboxCard
  private _addedCardTypes: ReviewCardType[] = []

  constructor(inboxCard: InboxCard) {
    this._inboxCard = inboxCard
  }

  execute(context: Application): Result<void, string> {
    const hasCardsOfThisVerse = context.reviewDeck
      .getVerseCards(this._inboxCard.verseId).length > 0

    // Step 1: remove card from the Inbox deck
    context.inboxDeck.cardMemorized(this._inboxCard)
    const cardTypes = {
      [InboxCardType.Text]: [
        ReviewCardType.NumberToText,
        ReviewCardType.TextToNumber
      ],
      [InboxCardType.Translation]: [
        ReviewCardType.NumberToTranslation,
        ReviewCardType.TranslationToNumber
      ]
    }
    this._addedCardTypes.push(...cardTypes[this._inboxCard.type])

    // Step 3: add all the rest card if required
    if (hasCardsOfThisVerse) {
      this._addedCardTypes.push(
        ReviewCardType.TextToTranslation,
        ReviewCardType.TranslationToText
      )
    }

    // Step 4: create cards and add to the Review deck
    const builder = new ReviewCardBuilder()
      .ofVerse(this._inboxCard.verseId)
      .dueTo(context.now)

    for (const cardTypeToCreate of this._addedCardTypes) {
      let lastDate = new Date(context.now)
      const anyCards = context.reviewDeck
        .getVerseCards(this._inboxCard.verseId)

      if (anyCards.length > 0) {
        lastDate = new Date(anyCards
          .map(x => x.dueTo)
          // Stryker disable next-line all
          .reduce((a, b) => a > b ? a : b, lastDate))
        lastDate.setDate(lastDate.getDate() + 1)
      }

      const card = builder
        .ofType(cardTypeToCreate)
        .dueTo(new Date(lastDate))
        .build()

      context.reviewDeck.addCard(card)
    }

    return Result.ok()
  }

  revert(context: Application): void {
    // TODO: doesn't restore to the same position
    context.inboxDeck.addCard(this._inboxCard)

    for (const addedCardType of this._addedCardTypes) {
      context.reviewDeck.getVerseCards(
        this._inboxCard.verseId, addedCardType
      ).forEach(x => context.reviewDeck.removeCard(x))
    }
  }
}
