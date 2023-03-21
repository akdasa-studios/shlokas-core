import { Value } from '@akdasa-studios/framework'

/**
 * Verse transliteration
 */
export class Text extends Value<'Text'> {
  /**
   * Initialize a new instance of Text class with the given lines
   */
  constructor (
    public readonly lines: string[],
  ) {
    super()
    if (lines.length <= 0) { throw new Error('lines must contain at least one line') }
    if (lines.some((line) => !line)) { throw new Error('lines must not contain empty values') }
  }
}
