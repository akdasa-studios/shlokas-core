import { Publication } from '@lib/models'

describe('Publication', () => {
  describe('constructor', () => {
    it('should return a new instance of Publication class', () => {
      expect(new Publication()).toBeInstanceOf(Publication)
    })
  })

  describe('isPublished', () => {
    it('should return false if the publication is not published', () => {
      expect(new Publication().isPublished).toBe(false)
    })

    it('should return true if the publication is published', () => {
      const publication = new Publication()
      publication.publish()
      expect(publication.isPublished).toBe(true)
    })
  })

  describe('publish', () => {
    it('should publish the publication', () => {
      const publication = new Publication()
      publication.publish()
      expect(publication.isPublished).toBe(true)
    })
  })

  describe('unpublish', () => {
    it('should unpublish the publication', () => {
      const publication = new Publication()
      publication.publish()
      publication.unpublish()
      expect(publication.isPublished).toBe(false)
    })
  })
})