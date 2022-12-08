import { loadFeature, autoBindSteps } from 'jest-cucumber'

import { inboxDeckSteps } from '@tests/features/decks/steps/InboxDeck.steps'
import { newContext } from '@tests/features/context'


beforeEach(() => { newContext() })

autoBindSteps([
  loadFeature('features/decks/inbox-deck.feature'),
], [
  inboxDeckSteps,
])
