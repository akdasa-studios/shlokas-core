import { contexts } from '@tests/features/context'
import { StepDefinitions } from 'jest-cucumber'


export const contextSteps: StepDefinitions = ({ given, when }) => {

  /* -------------------------------------------------------------------------- */
  /*                                    Given                                   */
  /* -------------------------------------------------------------------------- */

  given(/^I have the following devices:$/, (devices: Record<string, string>[]) => {
    devices.forEach(device => { contexts.getContext(device['Device Name']) })
  })

  /* -------------------------------------------------------------------------- */
  /*                                    When                                    */
  /* -------------------------------------------------------------------------- */

  when(/^I sync data between "(.*)" and "(.*)"$/, async (source: string, target: string) => {
    const app1 = contexts.getContext(source).app
    const app2 = contexts.getContext(target).app
    await app1.sync(app2.repositories)
  })
}
