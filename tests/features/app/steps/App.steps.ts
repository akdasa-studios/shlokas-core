import { StepDefinitions } from 'jest-cucumber'
import { contexts } from '@tests/features/context'


export const appSteps: StepDefinitions = ({ given, when }) => {

  /* -------------------------------------------------------------------------- */
  /*                                    Given                                   */
  /* -------------------------------------------------------------------------- */

  given(/^Now is "(.*)"$/, (date: string) => {
    contexts.$.timeMachine.set(new Date(date)) // ? T00:00
  })

  /* -------------------------------------------------------------------------- */
  /*                                    When                                    */
  /* -------------------------------------------------------------------------- */

  when('I revert the last action', async () => {
    await contexts.$.processor.revert()
  })

}
