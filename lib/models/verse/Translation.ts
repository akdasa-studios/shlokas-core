import { Value } from '@akdasa-studios/framework'

/**
 * Verse translation
 */
export class Translation extends Value<'Translation'> {
  /**
   * Initialize a new instance of Translation class with the given text
   */
  constructor (
    public readonly text: string,
  ) {
    super()
    if (!text) { throw new Error('text is required') }
    if (!text.trim()) { throw new Error('text must not be empty') }
  }
}
