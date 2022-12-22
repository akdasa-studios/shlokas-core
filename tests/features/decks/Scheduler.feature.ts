import { appSteps } from '@tests/features/app/steps/App.steps'
import { newContext } from '@tests/features/context'
import { schedulerSteps } from '@tests/features/decks/steps/Scheduler.steps'
import { autoBindSteps, loadFeature } from 'jest-cucumber'

beforeEach(() => { newContext() })

autoBindSteps([
  loadFeature('features/decks/Scheduler.feature'),
], [
  appSteps,
  schedulerSteps
])
