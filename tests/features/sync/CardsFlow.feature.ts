import { appSteps } from '@tests/features/app/steps/App.steps'
import { newContext } from '@tests/features/context'
import { librarySteps } from '@tests/features/library/steps/Library.steps'
import { inboxDeckSteps } from '@tests/features/decks/steps/InboxDeck.steps'
import { contextSteps } from '@tests/features/sync/steps/Contexts.steps'
import { autoBindSteps, loadFeature } from 'jest-cucumber'

beforeEach(() => { newContext() })

autoBindSteps([
  loadFeature('features/sync/CardsFlow.feature'),
], [
  appSteps,
  librarySteps,
  inboxDeckSteps,
  contextSteps,
])
