import { Command, Result } from '@akdasa-studios/framework'
import { Application } from '@lib/app/Application'
import { InboxCard, InboxCardType, ReviewCardBuilder, ReviewCardQueries, ReviewCardType } from '@lib/models/cards'


export class InboxCardMemorized implements
  Command<Application, Result<void, string>>
{
  private _inboxCard: InboxCard
  private _addedCardTypes: ReviewCardType[] = []

  constructor(inboxCard: InboxCard) {
    this._inboxCard = inboxCard
  }

  async execute(context: Application): Promise<Result<void, string>> {
    const { ofVerse } = ReviewCardQueries
    const hasCardsOfThisVerse = (
      await context.reviewDeck.findCards(ofVerse(this._inboxCard.verseId))
    ).length > 0

    // Step 1: remove card from the Inbox deck
    await context.inboxDeck.cardMemorized(this._inboxCard)
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
      .dueTo(context.timeMachine.now)

    for (const cardTypeToCreate of this._addedCardTypes) {
      let lastDate = new Date(context.timeMachine.now)
      const { ofVerse } = ReviewCardQueries
      const anyCards = await context.reviewDeck
        .findCards(ofVerse(this._inboxCard.verseId))

      if (anyCards.length > 0) {
        // Stryker disable next-line all
        const maxDate = anyCards.map(x => x.dueTo).reduce((a, b) => a.getTime() > b.getTime() ? a : b, lastDate)
        lastDate = new Date(maxDate)
        lastDate.setDate(lastDate.getDate() + 1)
      }

      const card = builder
        .ofType(cardTypeToCreate)
        .dueTo(new Date(lastDate))
        .build()

      await context.reviewDeck.addCard(card)
    }

    return Result.ok()
  }

  async revert(context: Application): Promise<void> {
    // TODO: doesn't restore to the same position
    const { ofVerse, ofType } = ReviewCardQueries
    await context.inboxDeck.addCard(this._inboxCard)

    // TODO: get all cards by multiple cardtypes in one query
    for (const addedCardType of this._addedCardTypes) {
      const cards = await context.reviewDeck.findCards(
        ofVerse(this._inboxCard.verseId), ofType(addedCardType)
      )
      for (const card of cards) {
        await context.reviewDeck.removeCard(card)
      }
    }
  }
}
