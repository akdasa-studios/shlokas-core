import { StepDefinitions } from 'jest-cucumber'

import { context } from '@tests/features/context'


export const appSteps: StepDefinitions = ({ given, when }) => {

  /* -------------------------------------------------------------------------- */
  /*                                    Given                                   */
  /* -------------------------------------------------------------------------- */

  given(/^Now is "(.*)"$/, (date: string) => {
    context.app.timeMachine.set(new Date(date)) // ? T00:00
  })

  /* -------------------------------------------------------------------------- */
  /*                                    When                                    */
  /* -------------------------------------------------------------------------- */

  when('I revert the last action', () => {
    context.app.processor.revert()
  })

}
