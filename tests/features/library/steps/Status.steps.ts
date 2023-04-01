import { Language } from '@lib/models'
import { getContext } from '@tests/features/context'
import { StepDefinitions } from 'jest-cucumber'


export const libraryStatusSteps: StepDefinitions = ({ when }) => {

  /**
   * Check the status of a verse on a device
   * @param verseNumber Verse number
   * @param status Status of the verse
   * @param device Device name (optional)
   * @example Then Status of the verse "BG 1.1" is "Inbox"
   * @example Then Status of the verse "BG 1.1" is "Review" on "device1"
   */
  when(
    /^Status of the verse "(.*)" is "(\w*)"(?: on "(.*)")?$/,
    async (verseNumber: string, status: string, device: string) =>
    {
      const ctx         = getContext(device)
      const verse       = await ctx.library.getByNumber(new Language('en', 'en'), verseNumber)
      const verseStatus = await ctx.library.getStatus(verse.id)
      expect(verseStatus.inDeck).toEqual(status)
    })
}
