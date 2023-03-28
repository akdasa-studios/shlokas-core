import { Command, Result } from '@akdasa-studios/framework'
import { Application } from '@lib/app/Application'
import { InboxCard, InboxCardType, ReviewCardBuilder, ReviewCardQueries, ReviewCardType } from '@lib/models/cards'


export class InboxCardMemorized implements
  Command<Application, Result<void, string>>
{
  private _addedCardTypes: ReviewCardType[] = []

  constructor(public readonly inboxCard: InboxCard) {
  }

  async execute(context: Application): Promise<Result<void, string>> {
    const { ofVerse } = ReviewCardQueries
    const hasCardsOfThisVerse = (
      await context.reviewDeck.findCards(ofVerse(this.inboxCard.verseId))
    ).length > 0

    // Step 1: remove card from the Inbox deck
    await context.inboxDeck.cardMemorized(this.inboxCard)
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
    this._addedCardTypes.push(...cardTypes[this.inboxCard.type])

    // Step 3: add all the rest card if required
    if (hasCardsOfThisVerse) {
      this._addedCardTypes.push(
        ReviewCardType.TextToTranslation,
        ReviewCardType.TranslationToText
      )
    }

    // Step 4: create cards and add to the Review deck
    const builder = new ReviewCardBuilder()
      .ofVerse(this.inboxCard.verseId)
      .dueTo(context.timeMachine.now)

    for (const cardTypeToCreate of this._addedCardTypes) {
      let lastDate = nextDaysFrom(context.timeMachine.now, 1)
      const { ofVerse } = ReviewCardQueries
      const anyCards = await context.reviewDeck
        .findCards(ofVerse(this.inboxCard.verseId))

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
    this.inboxCard.forget()
    await context.repositories.inboxCards.save(this.inboxCard)
    // await context.inboxDeck.addCard(this.inboxCard)

    // TODO: get all cards by multiple cardtypes in one query
    for (const addedCardType of this._addedCardTypes) {
      const cards = await context.reviewDeck.findCards(
        ofVerse(this.inboxCard.verseId), ofType(addedCardType)
      )
      for (const card of cards) {
        await context.reviewDeck.removeCard(card)
      }
    }
  }
}


function nextDaysFrom(date: Date, days: number) {
  const result = new Date(date)
  result.setDate(result.getDate()+days)
  return result
}