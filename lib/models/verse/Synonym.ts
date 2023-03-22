import { Value } from '@akdasa-studios/framework'

/**
 * Synonym
 */
export class Synonym extends Value<'Synonym'> {
  /**
   * Initialize a new instance of Synonym class with the given word and translation
   */
  constructor (
    public readonly word: string,
    public readonly translation: string,
    public readonly lineNumber?: number
  ) {
    super()
    if (!word) { throw new Error('word is required') }
    if (!translation) { throw new Error('translation is required') }
  }
}
