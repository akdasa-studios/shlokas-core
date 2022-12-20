import { StepDefinitions } from 'jest-cucumber'

import { context } from '@tests/features/context'


export const appSteps: StepDefinitions = ({ given, when }) => {

  /* -------------------------------------------------------------------------- */
  /*                                    Given                                   */
  /* -------------------------------------------------------------------------- */

  given(/^Now is "(.*)"$/, (date: string) => {
    context.app.setNow(new Date(date))
  })

  /* -------------------------------------------------------------------------- */
  /*                                    When                                    */
  /* -------------------------------------------------------------------------- */

  when('I revert the last action', () => {
    context.app.processor.revert()
  })

}
