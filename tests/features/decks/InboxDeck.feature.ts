import { autoBindSteps, loadFeature } from 'jest-cucumber'
import { newContext } from '@tests/features/context'
import { inboxDeckSteps } from '@tests/features/decks/steps/InboxDeck.steps'


beforeEach(() => { newContext() })

autoBindSteps([
  loadFeature('features/decks/InboxDeck.feature'),
], [
  inboxDeckSteps,
])
