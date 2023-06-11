import { autoBindSteps, loadFeature } from 'jest-cucumber'
import { newContext } from '@tests/features/context'
import { inboxDeckSteps } from '@tests/features/decks/steps/InboxDeck.steps'
import { librarySteps } from '@tests/features/library/steps/Library.steps'
import { librarySearchSteps } from '@tests/features/library/steps/Search.steps'
import { libraryPublicationSteps } from '@tests/features/library/steps/Publication.steps'

beforeEach(() => { newContext() })

autoBindSteps([
  loadFeature('features/library/Publication.feature'),
], [
  inboxDeckSteps,
  librarySteps,
  librarySearchSteps,
  libraryPublicationSteps
])
