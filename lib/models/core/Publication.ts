import { Timestamp } from './Timestamp'
import { Optional } from './Utils'


export class Publication {
  private _publishedAt: Optional<Timestamp>

  /**
   * Returns timestamp when document was published.
   * @returns {Optional<Timestamp>} Timestamp when document was published or undefined if document is not published.
   */
  get publishedAt(): Optional<Timestamp> {
    return this._publishedAt
  }

  /**
   * Is document published?
   * @returns {boolean} true if published, false otherwise
   */
  get isPublished(): boolean {
    return this._publishedAt !== undefined
  }

  /**
   * Publish document.
   * @param {Timestamp} timeStamp Timestamp to publish document at. If not provided, current time is used.
   */
  publish(timeStamp?: Optional<Timestamp>) {
    this._publishedAt = timeStamp ?? new Date().getTime()
  }

  /**
   * Unpublish document.
   */
  unpublish() {
    this._publishedAt = undefined
  }
}