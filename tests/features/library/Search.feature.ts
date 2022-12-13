import { autoBindSteps, loadFeature } from 'jest-cucumber'
import { newContext } from '@tests/features/context'
import { inboxDeckSteps } from '@tests/features/decks/steps/InboxDeck.steps'
import { librarySearchSteps } from '@tests/features/library/steps/Search.steps'


beforeEach(() => { newContext() })

autoBindSteps([
  loadFeature('features/library/Search.feature'),
], [
  inboxDeckSteps,
  librarySearchSteps,
])
