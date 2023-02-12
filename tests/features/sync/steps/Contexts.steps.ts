import { getContext } from '@tests/features/context'
import { StepDefinitions } from 'jest-cucumber'


export const contextSteps: StepDefinitions = ({ given, when }) => {

  /**
   * Create a new device contexts
   * @param devices List of device names
   * @example Given I have the following devices:
   *            | Device Name |
   *            | device1     |
   *            | device2     |
   */
  given(
    /^I have the following devices:$/,
    (devices: Record<string, string>[]) =>
    {
      devices.forEach(device => { getContext(device['Device Name']) })
    })

  /**
   * Sync data between two devices
   * @param source Source device name
   * @param target Target device name
   * @example When I sync data between "device1" and "device2"
   */
  when(
    /^I sync data between "(.*)" and "(.*)"$/,
    async (source: string, target: string) =>
    {
      const app1 = getContext(source).app
      const app2 = getContext(target).app
      await app1.sync(app2.repositories)
    })
}
