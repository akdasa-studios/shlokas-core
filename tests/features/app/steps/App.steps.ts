import { StepDefinitions } from 'jest-cucumber'

import { context } from '@tests/features/context'


export const appSteps: StepDefinitions = ({ when }) => {

  /* -------------------------------------------------------------------------- */
  /*                                    When                                    */
  /* -------------------------------------------------------------------------- */

  when('I revert the last action', () => {
    context.app.processor.revert()
  })

}
