import { StepDefinitions } from 'jest-cucumber'
import { context as $c } from '@tests/features/context'


export const appSteps: StepDefinitions = ({ given, when }) => {

  /* -------------------------------------------------------------------------- */
  /*                                    Given                                   */
  /* -------------------------------------------------------------------------- */

  given(/^Now is "(.*)"$/, (date: string) => {
    $c.timeMachine.set(new Date(date)) // ? T00:00
  })

  /* -------------------------------------------------------------------------- */
  /*                                    When                                    */
  /* -------------------------------------------------------------------------- */

  when('I revert the last action', async () => {
    await $c.processor.revert()
  })

}
