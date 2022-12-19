import { appSteps } from '@tests/features/app/steps/App.steps'
import { newContext } from '@tests/features/context'
import { inboxDeckSteps } from '@tests/features/decks/steps/InboxDeck.steps'
import { librarySteps } from '@tests/features/library/steps/Library.steps'
import { libraryStatusSteps } from '@tests/features/library/steps/Status.steps'
import { autoBindSteps, loadFeature } from 'jest-cucumber'


beforeEach(() => { newContext() })

autoBindSteps([
  loadFeature('features/library/Status.feature'),
], [
  appSteps,
  inboxDeckSteps,
  librarySteps,
  libraryStatusSteps,
])
