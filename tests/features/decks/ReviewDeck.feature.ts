import { appSteps } from '@tests/features/app/steps/App.steps'
import { newContext } from '@tests/features/context'
import { inboxDeckSteps } from '@tests/features/decks/steps/InboxDeck.steps'
import { reviewDeckSteps } from '@tests/features/decks/steps/ReviewDeck.steps'
import { librarySteps } from '@tests/features/library/steps/Library.steps'
import { autoBindSteps, loadFeature } from 'jest-cucumber'

beforeEach(() => { newContext() })

autoBindSteps([
  loadFeature('features/decks/ReviewDeck.feature'),
], [
  appSteps,
  librarySteps,
  inboxDeckSteps,
  reviewDeckSteps,
])
