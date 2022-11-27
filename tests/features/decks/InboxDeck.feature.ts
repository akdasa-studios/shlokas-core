import { loadFeature, autoBindSteps } from 'jest-cucumber'

import { inboxDeckSteps } from '@tests/features/decks/steps/InboxDeck.steps'

autoBindSteps([
  loadFeature('features/decks/inbox-deck.feature'),
], [
  inboxDeckSteps,
])