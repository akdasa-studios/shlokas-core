import { Application } from '@lib/app/Application'
import { Context } from '@lib/app'
import { createApplication, createContext } from '@tests/env'
import { Command, Result } from '@akdasa-studios/framework'


class DummyCommand implements Command<Context, Result<string, void>> {
  async execute(): Promise<Result<string, void>> {
    return await Result.ok('1213')
  }
  revert() {
    // throw new Error('Method not implemented.')
  }
}

describe('App Context', () => {

  /* -------------------------------------------------------------------------- */
  /*                                   Context                                  */
  /* -------------------------------------------------------------------------- */

  let app: Application
  let secondContext: Context

  beforeEach(() => {
    app = createApplication()
    secondContext = createContext('second')
  })


  /* -------------------------------------------------------------------------- */
  /*                                   execute                                  */
  /* -------------------------------------------------------------------------- */

  describe('.changeContext', () => {
    it('adds translation and text cards to the inbox deck', () => {
      app.changeContext(secondContext)
      expect(app.context.name).toEqual('second')
    })
  })

  describe('.execute', () => {
    it('should call commandExecuted event', async () => {
      const spy = jest.fn()
      app.commandExecuted.subscribe(spy)
      await app.execute(new DummyCommand())
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('.revert', () => {
    it('should call commandReverted event', async () => {
      const spy = jest.fn()
      app.commandReverted.subscribe(spy)
      await app.execute(new DummyCommand())
      await app.revert()
      expect(spy).toHaveBeenCalled()
    })
  })

})