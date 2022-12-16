import { autoBindSteps, loadFeature } from 'jest-cucumber'
import { newContext } from '@tests/features/context'
import { inboxDeckSteps } from '@tests/features/decks/steps/InboxDeck.steps'
import { libraryStatusSteps } from '@tests/features/library/steps/Status.steps'


beforeEach(() => { newContext() })

autoBindSteps([
  loadFeature('features/library/Status.feature'),
], [
  inboxDeckSteps,
  libraryStatusSteps,
])
