import { getContext } from '@tests/features/context'
import { StepDefinitions } from 'jest-cucumber'


export const libraryPublicationSteps: StepDefinitions = ({ when }) => {

  /* -------------------------------------------------------------------------- */
  /*                                   Given                                    */
  /* -------------------------------------------------------------------------- */

  /**
   * Publish verse
   * @param verseNumber Verse number
   */
  when(
    /^I publish verse "(.*)"$/,
    async (verseNumber: string) =>
    {
      const ctx   = getContext()
      const verse = await ctx.findVerse(verseNumber, { unpublished: true })

      verse.publication.publish()
      await ctx.app.repositories.verses.save(verse)
    })

  /**
   * Unpublish verse
   * @param verseNumber Verse number
   */
  when(
    /^I unpublish verse "(.*)"$/,
    async (verseNumber: string) =>
    {
      const ctx   = getContext()
      const verse = await ctx.findVerse(verseNumber, { unpublished: true })

      verse.publication.unpublish()
      await ctx.app.repositories.verses.save(verse)
    })
}
